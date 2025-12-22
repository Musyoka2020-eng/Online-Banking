const express = require("express");
const router = express.Router();

// Admin dashboard route
router.get("/", (req, res) => {
    // Add authentication check for admin role
    if (req.session?.authenticated && req.session?.userRole === 'admin') {
        res.render("admin/dashboard", {
            title: "Admin Dashboard"
        });
    } else {
        res.redirect("/clients/login");
    }
});

// Export the router
module.exports = router;
