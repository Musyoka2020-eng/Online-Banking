// models/User.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost', // MySQL server host
    username: 'root',   // MySQL username
    password: '',       // MySQL password
    database: 'online_banking', // MySQL database name
});

const Account = sequelize.define('Account', {
    // Define your Account model fields
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Sync the model with the database
sequelize.sync()
    .then(() => {
        console.log('Account model synced with the database.');
    })
    .catch((error) => {
        console.error('Error syncing Account model:', error);
    });

module.exports = Account;
