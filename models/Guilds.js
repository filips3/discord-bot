module.exports = (sequelize, DataTypes) => {
    return sequelize.define('guilds', {
        guild_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: 'k!',
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};