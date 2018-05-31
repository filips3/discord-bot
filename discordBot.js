const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const config = require('./config.json');
const clean = require('./utilities/clean.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const { objectsSync, Users, CurrencyShop, UserItems, Guilds, GuildCommands } = require('./dbObjects.js');
const { UsersCache, GuildsCache } = require('./dbCache.js');

// load all commands
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// eval access to all variables
function evaluate(message, args) {
	try {
		const code = args.join(' ');
		let evaled = eval(code);
		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);
		message.channel.send(clean(evaled), {code:"xl"});
	}
	catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
}
module.exports.evaluate = evaluate;

client.on('ready', async() => {
	console.log(`Logged in as ${client.user.tag}!`);
	// get all guilds this bot is in and add them to database if needed
	client.guilds.forEach((guild, id) => {
		GuildsCache.addIfNotFound(id);
	});
	// alter db models if changed
	await objectsSync();
	// cache users from database
	(await Users.findAll()).forEach(u => UsersCache.set(u.user_id, u));
	// cache guilds from database
	(await Guilds.findAll()).forEach(g => GuildsCache.set(g.guild_id, g));
	console.log(`Database synced`);
	
	// now setup the listeners
	client.on('unhandledRejection', (reason, p) => {
		console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	});
	client.on('message', async message => {
		// if a bot sent message
		if (message.author.bot) return;
		
		// add 1 balance to this user
		UsersCache.add(message.author.id, 1);
		
		// if it's a DM, use bot's default prefix, else use guild prefix
		if (message.channel.type !== 'text')
			var prefix = config.prefix;
		else
			var prefix = GuildsCache.get(message.guild.id).prefix;
		
		// process the message
		if (!message.content.startsWith(prefix)) return;
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		
		// check if it's an actual command
		let command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) { // check if it's a custom guild command
			if (message.channel.type !== 'text') return;
			command = await GuildCommands.findOne({	where: { guild_id: message.guild.id, name: commandName } });
			if (!command) return;
			command.execute = (client, message, args) => { return message.channel.send(command.result); };
		}
		// check if it's a guild only command
		else if (command.guildOnly && message.channel.type !== 'text')
			return message.reply(`the \`${command.name}\` command can only be executed on a guild channel.`);
		
		// check if it's not on cooldown
		if (!cooldowns.has(command.name))
			cooldowns.set(command.name, new Discord.Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		var cooldownAmount = 1000;
		if (command.cooldown !== undefined) cooldownAmount *= command.cooldown;
		else cooldownAmount *= config.defaultCooldown;

		if (!timestamps.has(message.author.id)) {
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
		else {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
		
		// try to execute it
		try {
			command.execute(client, message, args);
		}
		catch (error) {
			console.error(error);
			message.reply(`there was an error trying to execute the  \`${command.name}\` command.`);
		}
	});
	client.on("guildCreate", guild => {
		GuildsCache.addIfNotFound(guild.id);
	});
	client.on("guildDelete", guild => {
	});
});

client.login(config.token);