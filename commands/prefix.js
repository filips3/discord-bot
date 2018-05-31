const { GuildsCache } = require('../dbCache.js');
module.exports = {
	name: 'prefix',
	description: 'Set bot prefix for this guild.',
	usage: 'PLACEHOLDER',
	permissionUser: 'MANAGE_GUILD',
	guildOnly: true,
	execute(client, message, args) {
		if (!message.guild.member(message.author).hasPermission('MANAGE_GUILD', false, true, true)) return message.reply(`you don\'t have the \`Manage Server\` permission!`);
		if (!args.length) return message.reply('you didn\'t provide a prefix!');
		const guild = GuildsCache.get(message.guild.id);
		guild.prefix = args[0];
		guild.save();
		message.reply(`command prefix successfully changed to \`${args[0]}\``);
	}
};