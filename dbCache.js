const Discord = require('discord.js');
const { Users, Guilds } = require('./dbObjects.js');

const UsersCache = new Discord.Collection();
Reflect.defineProperty(UsersCache, 'add', {
	value: async function add(id, amount) {
		const user = UsersCache.get(id);
		if (user) {
			user.balance += Number(amount);
			user.save();
			return;
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		UsersCache.set(newUser.user_id, newUser);
	},
});
Reflect.defineProperty(UsersCache, 'getBalance', {
	value: function getBalance(id) {
		const user = UsersCache.get(id);
		return user ? user.balance : 0;
	},
});

const GuildsCache = new Discord.Collection();
Reflect.defineProperty(GuildsCache, 'addIfNotFound', {
	value: function addIfNotFound(id) {
		Guilds.findOrCreate({ where: { guild_id: id } })
			.spread((guild, created) => {
				GuildsCache.set(guild.id, guild);
			});
	},
});

module.exports = { UsersCache, GuildsCache };