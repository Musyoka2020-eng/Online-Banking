// const Client = require("./Client");

module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        // Define your Chat model fields
        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chatId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sender: {
            type: DataTypes.ENUM('client', 'agent'),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'closed'),
            allowNull: false,
        },
    });

    // Associate Chat with Client
    // Chat.associate = (models) => {
    //     Chat.belongsTo(models.Client, {
    //         foreignKey: 'senderId',
    //         as: 'sender',
    //     });
    //     Chat.belongsTo(models.Client, {
    //         foreignKey: 'receiverId',
    //         as: 'receiver',
    //     });
    // };

    return Chat;
};