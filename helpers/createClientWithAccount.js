// Code to create a new client and an account associated with the client in a single transaction
const { models: { Client, Account } } = require('../models');
const sequelize = require('../models').sequelize;

// The function to create a new client and an account associated with the client in a single transaction
async function createClientWithAccount(clientData, accountData) {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Create a new client
        const client = await Client.create(clientData, { transaction });

        // Create an account associated with the new client
        const account = await Account.create({
            ...accountData,
            clientId: client.id, // Associate the account with the new client
        }, { transaction });

        // Commit the transaction
        await transaction.commit();

        return { client, account };
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        throw error; // Rethrow the error to handle it in the calling code
    }
}

// Export the function
module.exports = {
    createClientWithAccount,
};

// In this example, the createClientWithAccount function takes two parameters: clientData and accountData. The clientData parameter contains the data for creating a new client, and the accountData parameter contains the data for creating a new account associated with the client.