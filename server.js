const express = require('express');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;


// Import the Account model
const Account = require('./models/Account');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


console.log(app.locals);
function url(res, filename) {
    return res.sendFile(path.join(__dirname, filename));
}
// Routes
app.get('/', (req, res) => {
    url(res, 'index.html');
});

app.get('/create-account', (req, res) => {
    url(res, '/public/pages/create-account.html');
});

app.get('/login', (req, res) => {
    url(res, '/public/pages/login.html');
});

const apiRouter = express.Router();

apiRouter.get('/accounts', async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
