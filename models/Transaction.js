
//define the Transaction model
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        // Define your Transaction model fields
        accountNumber: {
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
        transactionDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Transaction;
}