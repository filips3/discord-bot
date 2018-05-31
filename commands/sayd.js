module.exports = {
	name: 'sayd',
	aliases: ['saydelete'],
	description: 'Copy your message and remove it.',
	usage: '<message>...',
	permissionBot: 'MANAGE_MESSAGES',
	guildOnly: true,
	execute(client, message, args) {
		if (!message.channel.permissionsFor(client.user).hasPermission('MANAGE_MESSAGES', false, true, true)) return message.reply(`I don\'t have the \`Manage Messages\` permission!`);
		message.delete();
		if (!args.length) return;
		const msg = args.join(' ');
		message.channel.send(`${msg}`);
	}
};