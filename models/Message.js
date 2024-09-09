// Purpose: Define the Message model and its associations.
const Chat = require('./Chat');

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        chatId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('sent', 'delivered', 'read'),
            allowNull: false,
        },
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Chat, {
            foreignKey: 'chatId',
            as: 'chatId',
        });
    };

    return Message;
};