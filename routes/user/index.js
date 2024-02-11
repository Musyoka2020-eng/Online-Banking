const express = require('express');
const router = express.Router();

// User dashboard route
router.get('/', (req, res) => {
    res.render('users/dashboard', { title: 'Dashboard', user: req.session.user });
});

// Export the router
module.exports = router;