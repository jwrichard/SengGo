var express = require('express');
var bodyParser = require('body-parser');
var mustache = require('mustache');
var Crypto = require('crypto')
var fs = require('fs'); // require the filesystem api
var app = express();

// Initialize DB
var Storage = require('./lib/MongoDB');
var db = new Storage(null, null, 'senggo');

// Add static files directory
app.use(express.static("public"));

// Used to parse JSON objects from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Define any used data structures



// Deliver our home page 
app.get('/', function (req, res) {

	// Check get params for messages to display
	var s = "", e = "";
	switch(req.query.s){
		case "1": s = '<div class="alert alert-success" role="alert">Welcome back! Succesfully logged in.</div>';
				break;
		default: break;
	}
	switch(req.query.e){
		case "1": e = '<div class="alert alert-danger" role="alert">Oops! We\'ve encountered an error with the system. Please try again later.</div>';
				break;
		default: break;
	}

	console.log(s);

	var user = checkLogin();
	console.log("User is logged in: "+user);
	if(user != ""){
		var page = fs.readFileSync("views/index.html", "utf8"); // bring in the HTML file
		var html = mustache.to_html(page, {loginstatus: '<div><p class="navbar-form navbar-right loginstatus">Welcome back! Logged in as: <span class="secondaryWord">'+user+'</span></p></div>', error: e, success: s}); // replace all of the data
		res.send(html);
	} else {
		var page = fs.readFileSync("views/index.html", "utf8"); // bring in the HTML file
		var html = mustache.to_html(page, {loginstatus: '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control"></div><div class="form-group"><input type="password" placeholder="Password" class="form-control"></div><button type="submit" class="btn btn-primary">Sign in</button></form>', authreq: '(Authentication required)', error: e, success: s}); // replace all of the data
		res.send(html);
	}
	
})

// About page
app.get('/about', function (req, res) {
   res.sendFile(__dirname + "/" + "about.html");
})

// Rules page
app.get('/rules', function (req, res) {
   res.sendFile(__dirname + "/" + "rules.html");
})

// Login page
app.get('/login', function (req, res) {
   res.sendFile(__dirname + "/" + "login.html");
})

// Login action
app.post('/actionLogin', function (req, res) {

	var username = req.body.username;
	var password = req.body.p

	if(doLogin(username, password)){
		res.redirect("/?s=1");
	} else {
		res.redirect("/login/?e=1");
	}
})

// Register page
app.get('/register', function (req, res) {
	var page = fs.readFileSync("views/register.html", "utf8"); // bring in the HTML file
	var html = mustache.to_html(page, {}); // replace all of the data
	res.send(html);

})

// Handle registration submission
app.post('/actionRegister', function (req, res) {
	// Get post params
	var username = req.body.username;
	var password = req.body.p

	// Check to see if username taken

	// If not, create a salted password and a salt
	var buf = Crypto.randomBytes(16).toString('base64'); 
	console.log(buf);

	encryptedPass = hex_sha512();

	// Store new user into db

	// Redirect to login page with success message
	res.redirect('/?s=2');
})



// Redirect all unsupported pages to the home page
app.get('*', function (req, res) {
    //res.redirect('/');
});


// Listen on default port 
var server = app.listen(80, function () {
  console.log("Server running at 127.0.0.1.");
})




// Functions to be called above
function doLogin(username, password){
	return true;
}

function checkLogin(){
	return "";
}