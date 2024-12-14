const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require('express-session');
const { Issuer, generators } = require('openid-client');

const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
app.set("view engine" , "ejs");





// =======================================>   OAuth < =====================================================


const jwtCheck = auth({
  audience: 'https://www.harinadh.click',
  issuerBaseURL: 'https://dev-mivpncvmxq7u78hd.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});










// ======================================>     AWS cognito     < =========================================


let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_S7mzuryvG');
    client = new issuer.Client({
        client_id: 'qd9ls1r6dde9413898tkhfuk9',
        client_secret: 'a12n1g23540gjuq2a3slrtb5bl9100hr0cu91vs7msmc08ot2ja',
        redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);


app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));





const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
};






app.get('/', checkAuth, (req, res) => {
    res.render('home', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo
    });
});





app.get('/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'phone openid email',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
});






// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
    try {
        const url = new URL(urlString);
        return url.pathname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

app.get(getPathFromURL('https://www.harinadh.click/search/index.html'), async (req, res) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            'https://d84l1y8p4kdic.cloudfront.net',
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state
            }
        );
        res.render("form",{msg:"this is from the k8s cluster--- modified line to detect the jenkins"})
        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        res.redirect('/');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
});






// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://<user pool domain>/logout?client_id=qd9ls1r6dde9413898tkhfuk9&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
});







//mongodb-service is the POD service name given - to launch the shard clusters 
const uri = "mongodb://mongodb-service/k8scluster";
/*
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));
*/
mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/pipeDatabase");

//this is for general use and atlas connection string.
//mongoose.connect("mongodb+srv://harinadh14:N%40dh2306@atlascluster.9fb52n9.mongodb.net/k8scluster");
//app.use(express.urlencoded({extended:"true"}));
const userschema = mongoose.Schema({
	name:String,
});

const user= mongoose.model("user" , userschema);

app.get("/",(req,resp)=>{
	resp.render("form",{msg:"this is from the k8s cluster--- modified line to detect the jenkins"})
})

app.get("/testauth", (req,resp)=>{ 
	resp.render("aws-auth", {msg: " this hello harinadh " }


) })

app.get("/search/index.html",(req,resp)=>{resp.send("this from the index html route on port 80");})
app.get("/submit",(req,resp)=>{
	const u = user( {
			  name:req.query.name,
		  })
	let k = u.save();
	if(k){ resp.send("data submitted successfully")  }
	else{
		resp.send("please reenter the data , above given is not saved yet");
	}
})





app.listen(80, "0.0.0.0", (resp) => {console.log("server started on 80")})
module.exports = app;
