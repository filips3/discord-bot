const { Guilds, GuildCommands } = require('../dbObjects.js');
module.exports = {
	name: 'command',
	aliases: ['comm'],
	description: 'PLACEHOLDER',
	usage: 'PLACEHOLDER',
	permissionUser: 'MANAGE_GUILD',
	guildOnly: true,
	async execute(client, message, args) {
		if (!message.guild.member(message.author).hasPermission('MANAGE_GUILD', false, true, true)) return message.reply(`you don\'t have the \`Manage Server\` permission!`);
		if (!args.length) return message.reply('please use add/edit/remove as the first argument');
		const subCommand = args.shift();
		const customCommand = args.shift().toLowerCase();
		const customCommandResult = args.join(' ');
		if (subCommand === 'add') {
			if (client.commands.get(customCommand)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(customCommand))) return message.reply('this command already exists');
			if (!customCommandResult) return message.reply('command result can\'t be empty');
			const res = await GuildCommands.findOrCreate({
				where: { guild_id: message.guild.id, name: customCommand },
				defaults: { result: customCommandResult }
			}).spread((instance, created) => {
				return created;
			});
			if (!res) return message.reply('this command already exists');
			return message.reply('custom command added');
		}
		if (subCommand === 'edit') {
			if (client.commands.get(customCommand)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(customCommand))) return message.reply('this command cannot be edited');
			if (!customCommandResult) return message.reply('command result can\'t be empty');
			const res = await GuildCommands.update(
				{ result: customCommandResult },
				{ where: { guild_id: message.guild.id, name: customCommand } }
			);
			if (res[0] === 0) return message.reply('this command doesn\'t exist');
			return message.reply('custom command edited');
		}
		if (subCommand === 'remove') {
			if (client.commands.get(customCommand)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(customCommand))) return message.reply('this command cannot be removed');
			const res = await GuildCommands.destroy({
				where: { guild_id: message.guild.id, name: customCommand }
			});
			if (res === 0) return message.reply('this command doesn\'t exist');
			return message.reply('custom command removed');
		}
		return message.reply('please use add/edit/remove as the first argument');
	}
};