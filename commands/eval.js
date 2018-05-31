const { ownerID } = require('../config.json');
const root = require('../discordBot.js');
module.exports = {
	name: 'eval',
	description: 'Evaluate string as javascript.',
	permissionUser: 'BOT_OWNER',
	cooldown: 0,
	execute(client, message, args) {
		if(message.author.id !== ownerID) return;
		root.evaluate(message, args);
	}
};