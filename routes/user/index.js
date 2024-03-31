// path: routes/user/index.js
const express = require('express');
const router = express.Router();
const { account } = require('../../controllers');
const { transaction } = require('../../controllers/account');

// User dashboard route
router.get('/', async (req, res) => {
    if (req.session.authenticated) {
        try {
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 5;
            const transactions = await transaction(req, res); // Assuming this fetches the transactions
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedTransactions = transactions.slice(startIndex, endIndex);
            const totalPages = Math.ceil(transactions.length / itemsPerPage);
            res.render('users/dashboard', { title: 'Dashboard', user: req.session.user, transactions: paginatedTransactions, currentPage: page, totalPages, itemsPerPage });
        } catch (error) {
            console.log(error);
            res.redirect('/clients/login');
        }
    } else {
        res.redirect('/clients/login');
    }
});

// user deposit route
router.post('/deposit', (req, res) => {
    if (req.session.authenticated) {
        account.deposit(req, res);
    } else {
        res.redirect('/clients/login');
    }
});

router.post('/withdraw', (req, res) => {
    if (req.session.authenticated) {
        account.withdraw(req, res);
    } else {
        res.redirect('/clients/login');
    }
});

router.get('/paybills', (req, res) => {
    if (req.session.authenticated) {
        res.render('users/dashboard', { title: 'Pay Bills', user: req.session.user });
    } else {
        res.redirect('/clients/login');
    }
});

// Export the router
module.exports = router;