const bcrypt = require("bcrypt");
const { models: { Client, Account, Transaction } } = require('../models');
const { obfuscateAccountNumber } = require('../helpers/accountEncrpt');
const sequelize = require('../models').sequelize;

module.exports = {
    deposit: async (req, res) => {
        try {
            const { transferFrom, depositTo, amount, password } = req.body;
            const client = await Client.findOne({ where: { email: req.session.user.email } });
            const currentPass = client.password;
            const match = await bcrypt.compare(password, currentPass);
            if (!match) return res.status(406).json({ error: "Invalid password" });

            const accounts = await Account.findAll({ where: { clientId: client.id } });
            const accountNumber = accounts.find(account => obfuscateAccountNumber(account.accountNumber) === depositTo)?.accountNumber;

            const transaction = await sequelize.transaction();
            try {
                const depositAccount = await Account.findOne({ where: { accountNumber } });
                if (!depositAccount) return res.status(404).json({ error: "Account not found" });

                const parsedAmount = Number.parseInt(amount);
                if (parsedAmount < 0) return res.status(400).json({ error: "Invalid amount" });

                const newBalance = { balance: Number.parseInt(depositAccount.balance) + parsedAmount };
                const updatedAccount = await depositAccount.update(newBalance, { transaction });

                const transferData = {
                    accountId: depositAccount.id,
                    amount: parsedAmount,
                    transactionType: 'credit',
                    transactionDescription: 'deposit',
                    reference: transferFrom
                };
                await Transaction.create(transferData, { transaction });
                await transaction.commit();

                Object.assign(req.session.user, { balance: updatedAccount.balance });

                return res.status(201).json({ message: 'Deposit successful, Thank you for banking with us' });
            } catch (error) {
                await transaction.rollback();
                return res.status(500).json({ error: error.message });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    transaction: async (req, res) => {
        // this is the transaction history function
        try {
            const client = await Client.findOne({ where: { email: req.session.user.email } });
            const accounts = await Account.findAll({ where: { clientId: client.id } });
            // lets remove any duplicated account numbers
            const accountNumbers = [...new Set(accounts.map(account => account.accountNumber))];
            //for each account number, get the transactions using the accountId
            const transactions = await Promise.all(accountNumbers.map(async accountNumber => {
                const account = await Account.findOne({ where: { accountNumber } });
                return await Transaction.findAll({ where: { accountId: account.id } });

            }));
            const transactionItems = [];
            for (const transaction of transactions) {
                for (const innerTransaction of transaction) {
                    const date = new Date(innerTransaction.createdAt).toLocaleString();
                    transactionItems.push({
                        date,
                        amount: innerTransaction.amount,
                        transactionType: innerTransaction.transactionType.charAt(0).toUpperCase() + innerTransaction.transactionType.slice(1),
                        reference: innerTransaction.reference,
                        description: innerTransaction.transactionDescription.charAt(0).toUpperCase() + innerTransaction.transactionDescription.slice(1),
                    });
                }
            }
            return transactionItems;
            // return res.status(200).json({ transactions });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    withdraw: async (req, res) => {
        try {
            const { transferTo, withdrawFrom, amount, password } = req.body;
            const client = await Client.findOne({ where: { email: req.session.user.email } });
            const currentPass = client.password;
            const match = await bcrypt.compare(password, currentPass);
            if (!match) return res.status(406).json({ error: "Invalid password" });

            const accounts = await Account.findAll({ where: { clientId: client.id } });
            const accountNumber = accounts.find(account => obfuscateAccountNumber(account.accountNumber) === withdrawFrom)?.accountNumber;

            const transaction = await sequelize.transaction();
            try {
                const withdrawAccount = await Account.findOne({ where: { accountNumber } });
                if (!withdrawAccount) return res.status(404).json({ error: "Account not found" });

                const parsedAmount = Number.parseInt(amount);
                if (parsedAmount < 0) return res.status(400).json({ error: "Invalid amount" });

                if (parsedAmount > withdrawAccount.balance) return res.status(400).json({ error: "Insufficient funds" });

                const newBalance = { balance: Number.parseInt(withdrawAccount.balance) - parsedAmount };
                const updatedAccount = await withdrawAccount.update(newBalance, { transaction });

                const transferData = {
                    accountId: withdrawAccount.id,
                    amount: parsedAmount,
                    transactionType: 'debit',
                    transactionDescription: 'withdrawal',
                    reference: transferTo
                };
                await Transaction.create(transferData, { transaction });
                await transaction.commit();

                Object.assign(req.session.user, { balance: updatedAccount.balance });

                return res.status(201).json({ message: 'Withdrawal successful' });
            } catch (error) {
                await transaction.rollback();
                return res.status(500).json({ error: error.message });
            }

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }
};



// for future reference, the following is the code for the accountEncrpt.js file:
// encryptedAccountNumber: encrypted,
// accountNumber: decrypted,
// const secretKey = '17c582d6b39247e62e93d3128c027015aa08771ae5f649de0201b9bfa9bfd389';
// const accountNumber = account.accountNumber;
// // Encrypt the account number
// const encrypted = encryptAccountNumber(accountNumber, secretKey);
// // console.log('Encrypted:', encrypted);
// // Decrypt the encrypted data
// const decrypted = decryptAccountNumber(encrypted.encryptedData, encrypted.iv, secretKey);
// console.log('Decrypted:', decrypted);