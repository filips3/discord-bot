const { Users, CurrencyShop } = require('../dbObjects.js');
const { UsersCache } = require('../dbCache.js');
module.exports = {
	name: 'shop',
	description: 'PLACEHOLDER',
	usage: 'PLACEHOLDER',
	guildOnly: true,
	async execute(client, message, args) {
		if (!args.length) {
			const items = await CurrencyShop.findAll();
			return message.channel.send(items.map(i => `${i.name}: ${i.cost}🍰`).join('\n'), { code: true });
		}
		const subCommand = args.shift();
		if (subCommand === 'buy') {
			if (!args.length) return message.reply(`please specify an item to buy!`);
			const arg = args.join(' ');
			
			const item = await CurrencyShop.findOne({
				where: { name: { $like: arg } },
			});
			if (!item) return message.channel.send('That item doesn\'t exist.');
			if (item.cost > UsersCache.getBalance(message.author.id)) {
				return message.channel.send(`You don't have enough currency, ${message.author}`);
			}

			const user = await Users.findOne({ where: { user_id: message.author.id } });
			UsersCache.add(message.author.id, -item.cost);
			await user.addItem(item);

			return message.channel.send(`You've bought a ${item.name}`);
		}
		return message.channel.send(`Incorrect command arguments`);
	}
};