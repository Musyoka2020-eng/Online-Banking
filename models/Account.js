module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        // Define your Account model fields
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        providerId: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        accountType: {
            type: DataTypes.ENUM('current', 'savings'),
            defaultValue: 'current',
        },
        accountStatus: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
        },
    });

    // Add hook to generate account number before creating a new account
    Account.beforeCreate(async (account, options) => {
        // Generate a unique account number
        const accountNumber = generateAccountNumber();
        account.accountNumber = accountNumber;
    });

    // Function to generate a unique 16-digit account number
    function generateAccountNumber() {
        let accountNumber = '';
        for (let i = 0; i < 16; i++) {
            accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
    }

    // Associate Account with Client
    Account.associate = (models) => {
        Account.belongsTo(models.Client, {
            foreignKey: 'clientId',
            as: 'client',
        });
    };

    // Associate Account with Provider
    Account.associate = (models) => {
        Account.belongsTo(models.Provider, {
            foreignKey: 'providerId',
            as: 'provider',
        });
    };

    return Account;
};
