module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define('Provider', {
        // Define your Provider model fields
        providerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        providerDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        providerUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        providerLogo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        providerStatus: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
        },
    });

    // Associate Provider with Account
    Provider.associate = (models) => {
        Provider.hasMany(models.Account, {
            foreignKey: 'providerId',
            as: 'accounts',
        });
    };

    return Provider;
}