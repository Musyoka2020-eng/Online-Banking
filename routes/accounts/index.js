const express = require("express");
const router = express.Router();
const { account } = require('../../controllers')


// User registration route
router.get("/", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect("/userDashboard");
    } else {
        res.render("create-account", {
            title: "Create Account"
        });
    }
});

// User registration route
router.post("/register-account", account.create);

// User login route
router.get("/login", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect("/userDashboard");
    } else {
        res.render("login", {
            title: "Login"
        });
    }
});

// User login route
router.post("/user-login", account.login);

//user logout route
router.get("/logout", account.logout);

// Export the router
module.exports = router;