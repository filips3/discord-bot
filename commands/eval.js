const { ownerID } = require('../config.json');
const root = require('../discordBot.js');
module.exports = {
	name: 'eval',
	description: 'Evaluate string as javascript.',
	permission: 'bot-owner',
	cooldown: 0,
	execute(message, args) {
		if(message.author.id !== ownerID) return;
		root.evaluate(message, args);
	}
};