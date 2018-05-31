const { UsersCache } = require('../dbCache.js');
module.exports = {
	name: 'leaderboard',
    aliases: ['top'],
	description: 'PLACEHOLDER',
	usage: 'PLACEHOLDER',
	guildOnly: true,
	execute(client, message, args) {
		return message.channel.send(
			UsersCache.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}🍰`)
				.join('\n'),
			{ code: true }
		);
	}
};