const { UsersCache } = require('../dbCache.js');
module.exports = {
	name: 'credits',
    aliases: ['kremowki'],
	description: 'Returns your current amount of 🍰.',
	usage: 'PLACEHOLDER',
	guildOnly: true,
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`${message.author.tag} has ${UsersCache.getBalance(message.author.id)}🍰`);
		}
		switch(args.length) {
			case 1:
				const target = message.mentions.users.first();
				if (!target) return message.channel.send(`User \`${args[0]}\` not found`);
				return message.channel.send(`${target.tag} has ${UsersCache.getBalance(target.id)}🍰`);
			case 2:
				const currentAmount = UsersCache.getBalance(message.author.id);
				const transferAmount = args.find(arg => !/<@!?\d+>/.test(arg));
				const transferTarget = message.mentions.users.first();

				if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
				if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
				if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

				UsersCache.add(message.author.id, -transferAmount);
				UsersCache.add(transferTarget.id, transferAmount);

				return message.channel.send(`Successfully transferred ${transferAmount}🍰 to ${transferTarget.tag}. Your current balance is ${UsersCache.getBalance(message.author.id)}🍰`);
		}
	}
};	