const express = require("express");
const router = express.Router();
const { account } = require('../../controllers');
const { redirect } = require("express/lib/response");


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

//Update user account
router.get("/update_profile", account.update);

// User login route
router.post("/user-login", account.login);

//user logout route
router.get("/logout", account.logout);

// Export the router
module.exports = router;