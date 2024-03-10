const bcrypt = require("bcrypt");
const crypto = require('crypto');
const saltRounds = 10;
const { models: { Client, Account } } = require('../models'); // Import the account model
const e = require("express");
const { encryptAccountNumber, decryptAccountNumber, obfuscateAccountNumber } = require('../helpers/accountEncrpt');
const { createClientWithAccount } = require('../helpers/createClientWithAccount');



// The account controller
module.exports = {

    // The create function here
    create: async (req, res) => {
        const { firstname, lastname, email, password } = req.body;
        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const emailCheck = await Client.findOne({
                where: {
                    email: email
                }
            });
            if (emailCheck) {
                return res.status(409).json({
                    error: "Email already exists",
                    message: "Please enter a different email address"
                });
            }
            // Create the account in the database
            // const account = await Account.create({
            //     firstName: firstname,
            //     lastName: lastname,
            //     email: email,
            //     password: hashedPassword,
            // });

            const clientData = {
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: hashedPassword, // Hashed password
            };

            console.log('Client data:', clientData);

            const accountData = {
                accountType: 'current',
            };

            // Create a new client and an account associated with the client
            createClientWithAccount(clientData, accountData)
                .then(({ client, account }) => {
                    console.log('Client and account created successfully:', client, account);
                    res.status(201).json(client);
                })
                .catch(error => {
                    console.error("Error creating client and account:", error);
                    res.status(502).json({
                        error: error.message,
                    });
                    console.error('Error creating clients and accounts:', error);
                });


            // res.status(201).json(account);
        } catch (error) {
            console.error("Error creating accounts:", error);
            res.status(501).json({
                error: error.message,
            });
        }
    },

    // The login function here
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            console.log(email, password);
            // Find the client in the database
            const client = await Client.findOne({
                where: {
                    email: email
                }
            });

            if (!client) {
                return res.status(404).json({
                    error: "user not found"
                });
            }
            // Compare the hashed password with the input password
            const passwordMatch = await bcrypt.compare(password, client.password);
            if (!passwordMatch) {
                return res.status(406).json({
                    error: "Invalid password"
                });
            }

            // Get the account associated with the client
            const account = await Account.findOne({
                where: {
                    clientId: client.id
                }
            });

            console.log('Account:', account);

            const secretKey = '17c582d6b39247e62e93d3128c027015aa08771ae5f649de0201b9bfa9bfd389';
            const accountNumber = account.accountNumber;

            // Encrypt the account number
            const encrypted = encryptAccountNumber(accountNumber, secretKey);
            console.log('Encrypted:', encrypted);

            // Decrypt the encrypted data
            const decrypted = decryptAccountNumber(encrypted.encryptedData, encrypted.iv, secretKey);
            console.log('Decrypted:', decrypted);

            const obfuscated = obfuscateAccountNumber(accountNumber);
            console.log(obfuscated); // Output: 1234********6789

            // Save the Client ID in the session
            req.session.user = {
                id: client.id,
                firstName: client.firstName,
                lastName: client.lastName,
                name: `${client.firstName} ${client.lastName}`,
                email: client.email,
                image: client.image,
                phone: client.phone,
                address: client.address,
                city: client.city,
                gender: client.gender,
                dateOfBirth: client.dateOfBirth,
                encryptedAccountNumber: encrypted,
                accountNumber: decrypted,
                realAccountNo: obfuscated,
                accountType: account.accountType,
                accountStatus: account.accountStatus,
                balance: account.balance,
                clientStatus: client.status,
                role: client.role,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
            };
            req.session.authenticated = true;
            res.status(200).json({
                message: "Login successful",
                user: req.session.user
            });

        } catch (error) {
            console.log("Error logging in:", error);
            res.status(500).json({
                error: error.message
            });
        }
    },

    update: async (req, res) => {
        const { firstName, lastName, email, phone, address, city, gender,
            dateOfBirth, accountType, oldpassword, password } = req.body;
        try {
        } catch (error) { }
    },


    // The logout function here
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/clients/login");
    }
}