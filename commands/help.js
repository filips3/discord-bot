const config = require('../config.json');
const root = require('../discordBot.js');
module.exports = {
	name: 'help',
    aliases: ['commands'],
    description: 'List all commands or info about a specific command.',
    usage: '<command name>',
	permission: 'everyone',
    execute(message, args) {
        const { commands } = message.client;
		const data = [];
		
		// if no command specified
		if (!args.length) {
			data.push('Here\'s a list of all standard commands:');
			data.push(commands.filter(command => command.permission === 'everyone').map(command => command.name).join(', '));
			data.push('And admin commands:');
			data.push(commands.filter(command => command.permission === 'admin').map(command => command.name).join(', '));
			data.push(`\nYou can send \`${config.prefix}help <command name>\` to get info on a specific command!`);
			
			message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type !== 'dm') {
						message.channel.send('I\'ve sent you a list of available commands');
					}
				})
				.catch(() => message.reply('it seems like I can\'t DM you!'));
		}
		else {
			// check if it's an actual command
			const command = root.client.commands.get(args[0])
				|| root.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
			if (!command) return message.reply(`command ${command.name} does not exist`);

			data.push(`**Name:** ${command.name}`);

			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
			if (command.permission) data.push(`**Can be used by:** ${command.permission}`);
			
			var cooldownAmount;
			if (command.cooldown !== undefined) cooldownAmount = command.cooldown;
			else cooldownAmount = config.defaultCooldown;
			data.push(`**Cooldown:** ${cooldownAmount.toFixed(1)} second(s)`);
			
			message.channel.send(data, { split: true });
		}
    }
};