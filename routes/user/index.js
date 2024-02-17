// path: routes/user/index.js
const express = require('express');
const router = express.Router();

// User dashboard route
router.get('/', (req, res) => {
    res.render('users/dashboard', { title: 'Dashboard', user: req.session.user });
});

// User profile route
router.get('/edit_profile', (req, res) => {
    res.render('users/dashboard', { title: 'Profile', user: req.session.user });
});

// Export the router
module.exports = router;