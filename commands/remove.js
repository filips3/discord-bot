module.exports = {
	name: 'remove',
	aliases: ['prune'],
	description: 'Remove messages in bulk.',
	usage: 'PLACEHOLDER',
	permissionUser: 'MANAGE_MESSAGES',
	permissionBot: 'MANAGE_MESSAGES',
	guildOnly: true,
	async execute(client, message, args) {
		if (!message.channel.permissionsFor(message.author).hasPermission('MANAGE_MESSAGES', false, true, true)) return message.reply(`you don\'t have the \`Manage Messages\` permission!`);
		if (!message.channel.permissionsFor(client.user).hasPermission('MANAGE_MESSAGES', false, true, true)) return message.reply(`I don\'t have the \`Manage Messages\` permission!`);
		if (!args.length || !Number.isInteger(Number(args[0]))) return message.reply(`specify how many messages to remove!`);
		(args[0] > 100) ? 100 : args[0];
		const channel = message.channel;
		await message.delete().catch(console.error);
		let messages = await channel.fetchMessages({ limit: args[0] }).catch(console.error);
		const count = messages.array().length;
		Promise.all(messages.map(async m => await m.delete())).then(p => {
			channel.send(`Deleted \`${count}\` messages`).then(m => m.delete(3000)).catch(console.error);
		}).catch(console.error);
	}
};