const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const config = require('./config.json');
const clean = require('./utilities/clean.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const { Users, CurrencyShop } = require('./dbObjects.js');
const { currency } = require('./Reflect.js');

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
module.exports.client = client;

client.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

client.on('ready', async() => {
	console.log(`Logged in as ${client.user.tag}!`);
	
	// sync currency to database
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
});

client.on('message', message => {
	// if a bot sent message
	if (message.author.bot) return;
    currency.add(message.author.id, 1);
	
	// process the message
	if (!message.content.startsWith(config.prefix)) return;
	const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
	
	// check if it's an actual command
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	
	// check if it should be executed
	if (command.guildOnly && message.channel.type !== 'text')
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
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`there was an error trying to execute the  \`${command.name}\` command.`);
	}
});
	
client.login(config.token);