const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
app.set("view engine", "ejs");

// ============================ OAuth2 Authentication (Cognito) ============================

let client;

// Initialize OpenID Client for Cognito
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_S7mzuryvG');
    client = new issuer.Client({
        client_id: 'qd9ls1r6dde9413898tkhfuk9',
        client_secret: 'a12n1g23540gjuq2a3slrtb5bl9100hr0cu91vs7msmc08ot2ja',
        redirect_uris: ['https://your-alb-domain/cognito/callback'],  // Adjust this to match ALB URL
        response_types: ['code'],
    });
};
initializeClient().catch(console.error);

// ========================= Session Management =========================
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
}));

// Trust the proxy for secure headers (necessary if behind ALB with HTTPS termination)
app.set('trust proxy', 1); // Trust the first proxy (ALB)

// Middleware to check authentication status
const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
};

// ===================== Routes =========================

// Home route - checks if user is authenticated and renders appropriate view
app.get('/cognito', checkAuth, (req, res) => {
    res.render('home', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo,
    });
});

// Login route - initiate the authentication flow
app.get('/cognito/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'openid email profile',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
});

// Callback route - Cognito will redirect here after successful authentication
app.get('/cognito/callback', async (req, res) => {
    try {
        // Get authorization code from query params
        const params = client.callbackParams(req);
        
        // Get the token set from Cognito
        const tokenSet = await client.callback(
            'https://your-alb-domain/cognito/callback', // Adjust to match ALB URL
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state,
            }
        );

        // Get user info from the token
        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo; // Save user info to session

        // Redirect to the main app (form.ejs page)
        res.redirect('/cognito/form');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/cognito');
    }
});

// Form route - protected route after authentication
app.get('/cognito/form', checkAuth, (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect('/cognito/login');
    }

    res.render("form", {
        msg: "Welcome to the form page!",
        userInfo: req.session.userInfo,
    });
});

// Logout route - clear session and redirect to Cognito logout page
app.get('/cognito/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_S7mzuryvG/logout?client_id=qd9ls1r6dde9413898tkhfuk9&logout_uri=https://your-alb-domain/cognito`;
    res.redirect(logoutUrl);
});

// MongoDB connection setup
mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/pipeDatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// MongoDB Schema and Model
const userschema = mongoose.Schema({
    name: String,
});
const user = mongoose.model("user", userschema);

// Routes for form submission and search page
app.get("/cognito/submit", (req, resp) => {
    const u = new user({
        name: req.query.name,
    });
    u.save()
        .then(() => resp.send("Data submitted successfully"))
        .catch(() => resp.send("Please reenter the data, it was not saved"));
});

app.get("/cognito/search/index.html", (req, resp) => {
    resp.send("This is from the index.html route on port 80");
});

// Start the server on port 80 (ensure ALB forwards traffic to this port)
app.listen(80, "0.0.0.0", () => {
    console.log("Server started on port 80");
});

module.exports = app;
