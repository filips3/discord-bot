const { currency } = require('../Reflect.js');
const root = require('../discordBot.js');
module.exports = {
	name: 'leaderboard',
    aliases: ['top'],
	description: 'PLACEHOLDER',
	usage: 'PLACEHOLDER',
	permission: 'everyone',
	guildOnly: true,
	execute(message, args) {
		const client = root.client;
		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}🍰`)
				.join('\n'),
			{ code: true }
		);
	}
};