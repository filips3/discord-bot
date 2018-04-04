module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_item', {
        user_id: {
			type: DataTypes.STRING,
            allowNull: false,
		},
        item_id: {
			type: DataTypes.STRING,
            allowNull: false,
		},
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
    }, {
        timestamps: false,
    });
};