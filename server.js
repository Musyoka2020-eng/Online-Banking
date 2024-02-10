const express = require("express");
const path = require("path");
const multer = require("multer");
const { randomUUID } = require("crypto");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const upload = multer();
const app = express();
const db = require('./models');
const port = process.env.PORT || 3000;


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(upload.array());
app.use(session({
    secret: randomUUID(),
    saveUninitialized: true,
    cookie: {
        sameSite: "strict",
        // secure: true,
        httpOnly: true,
    }
}));
app.use(expressLayouts);

// Pass __dirname to the views as a local variable
app.use((req, res, next) => {
    res.locals.__dirname = path.join(__dirname, "views");
    next();
});

// Pass the route variable to views as a local variable
app.use((req, res, next) => {
    res.locals.route = req.path;
    next();
});


// Set the view engine
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");

// Routes
const home = require("./routes/home");
const account = require("./routes/accounts");
// const login = require("./routes/login");

// Use the routes in the app
app.use("/", home);
app.use("/accounts", account);
// app.use("/login", login);

(async () => {
    await db.sequelize.sync()
})();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.redirect('/accounts/login'); 
    }
};

// Route to render dashboard page
app.get('/dashboard', isAuthenticated, (req, res) => {
    // Render dashboard page only if user is authenticated
    res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

// 404 route
app.use("*", (req, res) => {
    res.render("404", {
        title: "Page Not Found"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});