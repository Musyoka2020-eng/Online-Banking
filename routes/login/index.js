const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

//Import the Account model
const Account = require("../../models/Account");



router.get("/", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

router.post("/user-login", async (req, res) => {
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
});




// Export the router
module.exports = router;