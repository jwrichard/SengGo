var express = require('express');
var bodyParser = require('body-parser');
var mustache = require('mustache');
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
	console.log("Test");

	var user = checkLogin();
	console.log("User is logged in: "+user);
	if(user != ""){
		var page = fs.readFileSync("views/index.html", "utf8"); // bring in the HTML file
		var html = mustache.to_html(page, {loginstatus: '<div><p class="navbar-form navbar-right loginstatus">Welcome back! Logged in as: <span class="secondaryWord">'+user+'</span></p></div>'}); // replace all of the data
		res.send(html);
	} else {
		var page = fs.readFileSync("views/index.html", "utf8"); // bring in the HTML file
		var html = mustache.to_html(page, {loginstatus: '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control"></div><div class="form-group"><input type="password" placeholder="Password" class="form-control"></div><button type="submit" class="btn btn-primary">Sign in</button></form>', authreq: '(Authentication required)'}); // replace all of the data
		res.send(html);
	}
	
})

// About page
/*
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
	var password = req.body.p;

	if(doLogin(username, password)){
		res.sendFile(__dirname + "/" + "index.html");
	} else {
		res.sendFile(__dirname + "/" + "login.html");
	}
})

// Register page
app.get('/register', function (req, res) {
   res.sendFile(__dirname + "/" + "register.html");
})

// Redirect all unsupported pages to the home page
app.get('*', function (req, res) {
    //res.redirect('/');
});

*/

// Listen on default port 
var server = app.listen(80, function () {
  console.log("Server running at 127.0.0.1.");
})




// Functions to be called above
function doLogin(username, password){
	return false;
}

function checkLogin(){
	return "";
}