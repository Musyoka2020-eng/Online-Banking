const express = require('express');
const router = express.Router();

// Logout route
router.get('/', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

// Export the router
module.exports = router;