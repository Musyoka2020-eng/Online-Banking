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
// some global variables



// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(upload.array());
app.use(session({
    secret: randomUUID(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "strict",
        // secure: true,
        httpOnly: true,
    }
}));
//image rendering
app.get('/user-profile/:imageFilename', (req, res) => {
    const imageFilename = req.params.imageFilename;
    const imagePath = (path.join(__dirname, 'public/upload/user_profile/', imageFilename));
    res.sendFile(imagePath);
});

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

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.redirect('clients/login');
    }
};

// Middleware to check if user is authenticated globally
const isAuthenticatedGlobally = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        res.locals.isAuthenticated = true; // Set a global variable
    } else {
        res.locals.isAuthenticated = false; // Set a global variable
    }
    next();
};

// Apply the global middleware to check authentication
app.use(isAuthenticatedGlobally);



// Set the view engine
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");

// Routes
const home = require("./routes/home");
const client = require("./routes/clients");
const userDashboard = require("./routes/user");

// Use the routes middlewares in the app
app.use("/", home);
app.use("/clients", client);
app.use("/userDashboard", userDashboard);

(async () => {
    await db.sequelize.sync()
})();

// 404 route
app.use("*", (req, res) => {
    res.render("404", {
        title: "Page Not Found"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    try {
        db.sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});