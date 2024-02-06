const express = require("express");
const router = express.Router();

// Home page route
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
});

// About page route
// router.get("/about", (req, res) => {
//     res.send("About page");
// });

// Export the router
module.exports = router;