const { currency } = require('../Reflect.js');
module.exports = {
	name: 'credits',
    aliases: ['kremowki'],
	description: 'Returns your current amount of 🍰.',
	usage: 'PLACEHOLDER',
	permission: 'everyone',
	guildOnly: true,
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`${message.author.tag} has ${currency.getBalance(message.author.id)}🍰`);
		}
		switch(args.length) {
			case 1:
				const target = message.mentions.users.first();
				return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}🍰`);
			case 2:
				const currentAmount = currency.getBalance(message.author.id);
				const transferAmount = args.find(arg => !/<@!?\d+>/.test(arg));
				const transferTarget = message.mentions.users.first();

				if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
				if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
				if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

				currency.add(message.author.id, -transferAmount);
				currency.add(transferTarget.id, transferAmount);

				return message.channel.send(`Successfully transferred ${transferAmount}🍰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}🍰`);
		}
	}
};