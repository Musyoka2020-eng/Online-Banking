export default (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        // Define your Chat model fields
        senderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
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

    // Associate Chat with Client
    Chat.associate = (models) => {
        Chat.belongsTo(models.Client, {
            foreignKey: 'senderId',
            as: 'sender',
        });
        Chat.belongsTo(models.Client, {
            foreignKey: 'receiverId',
            as: 'receiver',
        });
    };

    return Chat;
};