const bcrypt = require("bcrypt");
const saltRounds = 10;

const { models: { Account } } = require('../models');

module.exports = {
    
    create: async (req, res) => {

        const {
            firstname,
            lastname,
            email,
            password
        } = req.body;

        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const emailCheck = await Account.findOne({
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
            const account = await Account.create({
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: hashedPassword,
            });

            res.status(201).json(account);
        } catch (error) {
            console.error("Error creating account:", error);
            res.status(501).json({
                error: error.message,
            });
        }
    },

    findOne: async (req, res) => {
        const {
            email,
            password
        } = req.body;
        try {
            // Find the account in the database
            const account = await Account.findOne({
                where: {
                    email: email
                }
            });
            if (!account) {
                return res.status(404).json({
                    error: "Account not found"
                });
            }
            // Compare the hashed password with the input password
            const passwordMatch = await bcrypt.compare(password, account.password);
            if (!passwordMatch) {
                return res.status(406).json({
                    error: "Invalid password"
                });
            }
            // Save the account ID in the session
            let userAccount = {
                id: account.id,
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            };
            res.status(200).json({
                message: "Login successful",
            });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({
                error: error.message
            });
        }
    }
}