const express = require('express');
const path = require('path'); // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

// Import the Account model
const Account = require('./models/Account');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
    // Use path.join to get the correct file path
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoints and other server logic here
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
