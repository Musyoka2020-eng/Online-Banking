const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const saltRounds = 10;



const app = express();
const port = process.env.PORT || 3000;

// Import the Account model
const Account = require('./models/Account');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(upload.array());
app.use(cookieParser());
app.use(session({ secret: 'randomUUID', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));

function url(res, filename) {
    if (!filename) {
        return res.sendFile(path.join(__dirname, 'views/404.html'));
    } else if (filename === '/') {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }

    return res.sendFile(path.join(__dirname, filename));
}

function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
}

function isLoggedin(req) {
    return req.session && req.session.user;
}


// Routes
app.get('/', (req, res) => {
    url(res, 'index.html');
});

app.get('/create-account', (req, res) => {
    if (isLoggedin(req)) {
        return url(res, '/');
    } else {
        url(res, 'views/create-account.html');
    }
});


app.post('/register-account', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    req.params

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const emailCheck = await Account.findOne({ where: { email: email } });
        if (emailCheck) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        // Create the account in the database
        const account = await Account.create({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: hashedPassword,
        });


        res.status(201).json(account);

    } catch (error) {
        console.error('Error creating account:', error);
        res.status(501).json({ error: error.message });
    }
});


app.get('/login', (req, res) => {
    if (isLoggedin(req)) {
        url(res, '/');
        return res.status(409).json({ error: 'User already logged in' });
    }
    url(res, 'views/login.html');
});

app.post('/user-login', async (req, res) => {
    if (isLoggedin(req)) {
        url(res, '/');
        return res.status(409).json({ error: 'User already logged in' });
    }
    const { email, password } = req.body;

    try {
        // Find the account in the database
        const account = await Account.findOne({ where: { email: email } });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        // Compare the hashed password with the input password
        const passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
            return res.status(406).json({ error: 'Invalid password' });
        }
        // Save the account ID in the session
        let userAccount = {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        };
        req.session.user = userAccount;
        res.status(200).json({ message: 'Login successful', user: userAccount });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: error.message });
    }
});


app.use((req, res, next) => {
    if (isLoggedin(req)) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.use('*', (req, res) => {
    url(res, 'views/404.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
