const express = require("express");
const router = express.Router();
const { account } = require('../../controllers')


// User registration route
router.get("/", (req, res) => {
    res.render("create-account", {
        title: "Create Account"
    });
});

// User registration route
router.post("/register-account", account.create);

// User login route
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

router.post("/user-login", account.findOne);

// Export the router
module.exports = router;