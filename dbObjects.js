const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const CurrencyShop = sequelize.import('models/CurrencyShop');
const UserItems = sequelize.import('models/UserItems');
UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });
const Guilds = sequelize.import('models/Guilds');
const GuildCommands = sequelize.import('models/GuildCommands');
GuildCommands.belongsTo(Guilds, { foreignKey: 'guild_id', as: 'guild' });

async function objectsSync() {
	sequelize.sync().catch(console.error);
	sequelize.sync({ alter:true }).catch(console.error);
}

Users.prototype.addItem = async function(item) {
    const userItem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    if (userItem) {
        userItem.amount += 1;
        return userItem.save();
    }

    return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};
Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        include: ['item'],
    });
};

module.exports = { objectsSync, Users, CurrencyShop, UserItems, Guilds, GuildCommands };