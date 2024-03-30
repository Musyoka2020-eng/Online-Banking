
//define the Transaction model
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        // Define your Transaction model fields
        accountId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        transactionType: {
            type: DataTypes.ENUM('credit', 'debit'),
            allowNull: false,
        },
        transactionDescription: {
            type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
            allowNull: false,
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Associate Transaction with Account
    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Account, {
            foreignKey: 'accountId',
            as: 'account',
        });
    };

    return Transaction;
}