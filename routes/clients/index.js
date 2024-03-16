const express = require("express");
const router = express.Router();
const { client } = require('../../controllers');
const { redirect } = require("express/lib/response");


// User registration route
router.get("/", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect("/userDashboard");
    } else {
        res.render("create-client", {
            title: "Create User"
        });
    }
});

// User registration route
router.post("/register-client", client.create);

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

// User profile route
router.get('/edit_profile', (req, res) => {
    if (req.session.authenticated) {
        res.render('users/dashboard', { title: 'Edit Profile', user: req.session.user });
    } else {
        res.redirect('/clients/login');
    }
});

//Update user account
router.put("/update-profile", client.update);

// User login route
router.post("/user-login", client.login);

//user logout route
router.get("/logout", client.logout);

// Export the router
module.exports = router;