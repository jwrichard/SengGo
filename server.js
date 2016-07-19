var express = require('express');
var bodyParser = require('body-parser');
var mustache = require('mustache');
var Crypto = require('crypto')
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var request = require('request');

// Initialize DB
var Storage = require('./lib/MongoDB');
var db = new Storage(null, null, 'senggo');

// Initialize server game module
var serverGameModule = require('./lib/game.js');

// Include any scripts we need for the backend server
var sha = require('./lib/sha512.js');

// Add static files directory
app.use(express.static("public"));
app.use(cookieParser())

// Constants
const blackTurn = 0;
const whiteTurn = 1;
const blackPassed = 2;
const whitePassed = 3;
const blackWon = 4;
const whiteWon = 5;

const blackPlayer = 1;
const whitePlayer = 2;

const PORT = 8000;

// Setup sessions and how the IDs are created
app.use(session({
  genid: function(req) {
    return Crypto.randomBytes(32).toString('base64'); // use UUIDs for session IDs 
  },
  secret: 'a10758sf31f1f9dsd90192e23smd546912fqsmsffn12',
  resave: false,
  saveUninitialized: true
}))

// Used to parse JSON objects from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

	(req.session.username ? user = req.session.username :  user = '');
	var pageData;
	if(user != ""){
		pageData = {loginstatus: '<div><p class="navbar-form navbar-right loginstatus">Logged in as: <span class="secondaryWord">'+user+'</span> | <a href="/actionLogout">Logout</a></p></div>', 
					error: e,
					menu: '',
					success: s
				}; // replace all of the data
	} else {
		pageData = {loginstatus: '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control" id="username" name="username" size="10"></div><div class="form-group"><input type="password" placeholder="Password" class="form-control" id="password" name="password" size="10"></div><input type="button" class="btn btn-primary" onclick="formhash(this.form, this.form.username, this.form.password);" value="Sign in" /></form>', 
					authreq: '(Authentication required)',
					menu: '<li><a href="/login">Sign in</a></li><li><a href="/register">Register</a></li>',
					error: e,
					success: s
				}; // replace all of the data
	}

	// Gather a list of the game the user is current in
	var query;
	if(user == ''){
		query = {userIP: req.connection.remoteAddress};
	} else {
		query = {$or: [{player1: user}, {player2: user}, {userIP: req.connection.remoteAddress}]};
	}

	db.getQuery('games', query, function(err, data){
		pageData.games = JSON.stringify(data);
		var page = fs.readFileSync("views/index.html", "utf8"); // bring in the HTML file
		var html = mustache.to_html(page, pageData); // replace all of the data
		res.send(html);
	});
	return;
})

// About page
app.get('/about', function (req, res) {
	(req.session.username ? user = req.session.username :  user = '');
	var pageData;
	if(user != ""){
		pageData = {loginstatus: '<div><p class="navbar-form navbar-right loginstatus">Logged in as: <span class="secondaryWord">'+user+'</span> | <a href="/actionLogout">Logout</a></p></div>', 
					menu: ''};
	} else {
		pageData = {loginstatus: '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control" size="10" id="username" name="username"></div><div class="form-group"><input type="password" size="10" placeholder="Password" class="form-control" id="password" name="password"></div><input type="button" class="btn btn-primary" onclick="formhash(this.form, this.form.username, this.form.password);" value="Sign in" /></form>',
					menu: '<li><a href="/login">Sign in</a></li><li><a href="/register">Register</a></li>'};
	}
   	var page = fs.readFileSync("views/about.html", "utf8"); // bring in the HTML file
	var html = mustache.to_html(page, pageData); // replace all of the data
	res.send(html);
})

// Rules page
app.get('/rules', function (req, res) {
	(req.session.username ? user = req.session.username :  user = '');
	var pageData;
	if(user != ""){
		pageData = {loginstatus: '<div><p class="navbar-form navbar-right loginstatus">Logged in as: <span class="secondaryWord">'+user+'</span> | <a href="/actionLogout">Logout</a></p></div>', 
					menu: ''};
	} else {
		pageData = {loginstatus: '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control" id="username" size="10" name="username"></div><div class="form-group"><input type="password" size="10" placeholder="Password" class="form-control" id="password" name="password"></div><input type="button" class="btn btn-primary" onclick="formhash(this.form, this.form.username, this.form.password);" value="Sign in" /></form>',
					menu: '<li><a href="/login">Sign in</a></li><li><a href="/register">Register</a></li>'};
	}
   	var page = fs.readFileSync("views/rules.html", "utf8"); // bring in the HTML file
	var html = mustache.to_html(page, pageData); // replace all of the data
	res.send(html);
})

// Login page
app.get('/login', function (req, res) {
	// Check get params for messages to display
	var s = "", e = "";
	switch(req.query.s){
		case "1": s = '<div class="alert alert-success" role="alert">Thanks for registering! You may now sign in below.</div>';
				break;
		default: break;
	}
	switch(req.query.e){
		case "1": e = '<div class="alert alert-danger" role="alert">Oops! We\'ve encountered an error with the system. Please try again later.</div>';
				break;
		case "2": e = '<div class="alert alert-danger" role="alert">Incorrect credentials provided. Please try again.</div>';
				break;
		case "3": e = '<div class="alert alert-danger" role="alert">You must login before playing Online matches.</div>';
				break;
		default: break;
	}
	// Send login page with appropriate error messages
   	var page = fs.readFileSync("views/login.html", "utf8"); // bring in the HTML file
	var html = mustache.to_html(page, {error: e, success: s}); // replace all of the data
	res.send(html);
})


// Register page
app.get('/register', function (req, res) {
	// Check get params for messages to display
	var e = "";
	switch(req.query.e){
		case "1": e = '<div class="alert alert-danger" role="alert">Oops! We\'ve encountered an error with the system. Please try again later.</div>';
				break;
		case "2": e = '<div class="alert alert-danger" role="alert">Oops! That username is currently taken. Please choose a new one.</div>';
		break;
		default: break;
	}

	var page = fs.readFileSync("views/register.html", "utf8"); // bring in the HTML file
	var html = mustache.to_html(page, {error: e}); // replace all of the data
	res.send(html);
})


// Game page
app.get('/play/:gameId', function (req, res) {
	var page = fs.readFileSync("views/play.html", "utf8"); // bring in the HTML file
	(req.session.username ? user = req.session.username :  user = '');

	// Display login status
	if(user != ''){
		l = '<div><p class="navbar-form navbar-right loginstatus">Logged in as: <span class="secondaryWord">'+user+'</span> | <a href="/actionLogout">Logout</a></p></div>';
	} else {
		l = '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control" id="username" name="username"></div><div class="form-group"><input type="password" placeholder="Password" class="form-control" id="password" name="password"></div><input type="button" class="btn btn-primary" onclick="formhash(this.form, this.form.username, this.form.password);" value="Sign in" /></form>';
	}

	// Send game data as param
	db.getQuery('games', {gameId: req.params.gameId}, function(err, result){
		if(err == null){
			var html = mustache.to_html(page, {gameId: req.params.gameId, loginstatus: l, user: user, game: JSON.stringify(result[0])}); // replace all of the data
			res.send(html);
		} else {
			res.redirect("/?e=1");
		}
	});
})

// Replay page
app.get('/replay/:gameId/:move', function (req, res) {
	// Send game data as param
	var move = parseInt(req.params.move);
	db.getQuery('history', {gameId: req.params.gameId, move: move}, function(err, result){
		if(err == null){
			db.getHistoryMoveCount(req.params.gameId, function(count){
				if(req.params.move > count || req.params.move < 1 || count == 0){
					res.redirect("/?e=1");
					return;
				}
				var page = fs.readFileSync("views/replay.html", "utf8"); // bring in the HTML file
				(req.session.username ? user = req.session.username :  user = '');
				// Display login status
				if(user != ''){
					l = '<div><p class="navbar-form navbar-right loginstatus">Logged in as: <span class="secondaryWord">'+user+'</span> | <a href="/actionLogout">Logout</a></p></div>';
				} else {
					l = '<form class="navbar-form navbar-right" action="/actionLogin" method="post"><div class="form-group"><input type="text" placeholder="Username" class="form-control" id="username" name="username"></div><div class="form-group"><input type="password" placeholder="Password" class="form-control" id="password" name="password"></div><input type="button" class="btn btn-primary" onclick="formhash(this.form, this.form.username, this.form.password);" value="Sign in" /></form>';
				}
				var html = mustache.to_html(page, {game: JSON.stringify(result[0]), count: count}); // replace all of the data
				res.send(html);
				return;
			});
		} else {
			res.redirect("/?e=1");
			return;
		}
	});
})


/*
### End of pages, begin actions/tasks ####
*/

// Login action
app.post('/actionLogin', function (req, res) {

	// Get post data
	var username = req.body.username;
	var password = req.body.p

	// Compare with user in DB to see if match
	db.getQuery('users', {username: username}, function(err, result){
		if(result.length > 0){
			// Ok so that user exists, but did we supply right password?
			// Lets encrypt supplied pass with that users salt and see if matches their pass
			var salt = result[0].salt;
			var temp_password = sha.hex_sha512(password + salt);

			// Make the comparison
			if(temp_password === result[0].password){
				// Success! Set session and redirect
				req.session.username = username;
				res.redirect("/?s=1");
			} else {
				// WRONG! Redirect
				res.redirect("/login?e=2");
			}
		} else {
			// No user with that Id exists
			res.redirect("/login?e=2");
		}
	});
})

// Logout action
app.get('/actionLogout', function (req, res) {
	req.session.username = '';
	res.redirect('/');
})

// Calculate score from "game.js (lib)" and return score
app.get('/gameOver', function (req, res) {

})

// Handle registration submission
app.post('/actionRegister', function (req, res) {
	// Get post params
	var username = req.body.username;
	var password = req.body.p

	// Check to see if username taken
	db.getQuery('users', {username: username}, function(err, result){
		if(result.length > 0){
			// Redirect to register page with error that user exists
			res.redirect('/register?e=2')
		} else {
			// If not, create a salted password and a salt
			var buf = Crypto.randomBytes(16).toString('base64'); 
			var salt = sha.hex_sha512(buf);
			password = sha.hex_sha512(password + salt);

			// Create user document
			var user = {username: username, password: password, salt: salt};

			// Store new user into db
			db.addDocuments(user, function(result){
				if(result.result.ok != 1){
					// Redirect to register page with error
					res.redirect('/register?e=1');
				} else {
					// Redirect to login page with success message
					res.redirect('/login?s=1');
				}
			}, 'users');
		}
	});
})


// Create handlers for starting up a new game
app.post('/newLocalGame', function (req, res) {
	// Get game properties 
	var userIP = req.connection.remoteAddress;
	var boardSize = req.body.boardSize;
	var player1 = req.body.player1;
	var player2 = req.body.player2;

	// Create the game and redirect to it
	createGame(userIP, player1, player2, boardSize, res);
})

app.post('/newAIGame', function (req, res) {
	// Make sure user is logged in
	(req.session.username ? username = req.session.username :  username = '');
	if(username = '') res.redirect('/login?e=3');

	// Create the game and redirect to it
	var boardSize = req.body.boardSize;
	createGame(null, req.session.username, 'AI', boardSize, res);
})

app.post('/newPVPGame', function (req, res) {
	// Make sure user is logged in
	(req.session.username ? username = req.session.username :  username = '');
	if(username = '') res.redirect('/login?e=3');

	// Create the game and redirect to it
	var boardSize = req.body.boardSize;
	var opponent = req.body.player2;
	createGame(null, req.session.username, opponent, boardSize, res);
})

// Creates a new local, ai, or pvp game depending on parameters. Returns the games id.
function createGame(ip, player1, player2, boardSize, res){

	// Cast boardSize to int
	boardSize = parseInt(boardSize);

	// Create boardSize x boardSize array
	var board = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
	  board[i] = new Array(boardSize).fill(0);
	}

	// Create a unique game Id for this game and ensure it hasnt been used before
	var gameId = Crypto.randomBytes(3).toString('hex');
	db.getQuery('games', {gameId: gameId}, function(err, result){
		// If exists, generate a new longer random id
		if(result.length > 0){
			gameId = Crypto.randomBytes(5).toString('hex');
		}
		// Create the game object to insert
		
		var player2StartingScore = 0;
		if (boardSize == 9)
		{
			player2StartingScore = 5.5;
		}
		else if (boardSize == 13)
		{
			player2StartingScore = 6.5;
		}
		else if (boardSize == 19)
		{
			player2StartingScore = 	7.5;	
		}
		
		var game = {
			gameId: gameId,
			userIP: ip,
			board: board,
			boardSize: boardSize,
			player1: player1,
			player2: player2,
			player1score: 0,
			player2score: player2StartingScore,
			state: 0,
			move: 0
		}
		// Insert the new game into the db
		db.addDocuments(game, function(result){
			if(result.result.ok != 1){
				return false;
			} else {
				// Redirect the user
				res.redirect('/play/'+gameId);
			}
		}, 'games');
	});
}

// Handle a request for a move, or the sending of a move
app.post('/sendMove', function (req, res) {
	// Get parameters
	var gameId = req.body.gameId;
	var x = parseInt(req.body.x);
	var y = parseInt(req.body.y);
	var pass = (req.body.pass == 'true' || req.body.pass == true);
	var user = req.session.username;
	var reqIP = req.connection.remoteAddress;
	var board;
	var color;
	var ai = req.body.ai; // bool that says if AI sent this request 

	// Get the game board from the server
	db.getQuery('games', {gameId: gameId}, function(err, result){
		board = result[0].board;
		var player1 = result[0].player1;
		var player2 = result[0].player2;
		var userIP = result[0].userIP;
        
		// Make sure a valid user is sending the request
		if(userIP == null){
			// AI or PvP game
			// Check if AI sent this move
			if(ai != undefined && ai != null){
				console.log("AI sent this request!");
				color = 2;
			} else if(user == player1){
				console.log("Player1 sent this request!");
				color = 1;
			} else if(user == player2){
				console.log("Player2 sent this request!");
				color = 2;
			} else {
				// User is not in this game, they cannot send moves
				console.log("User is not in this game! No action taken");
				res.send(result[0]);
				return;
			}
		} else {
			// Local game
			console.log("Local game");
			if(reqIP == userIP){
				// If local game, and right IP, next move depends on current state
				switch(result[0].state){
					case 0: color = 1; break;
					case 1: color = 2; break;
					case 2: color = 2; break;
					case 3: color = 1; break;
					default: res.send(result[0]); break; // Game is over, no updates
				}
			} else {
				// Cant move, since not in this local game! Send same state back
				console.log("Can't send move since not correct player in the local game!");
				res.send(result[0]);
				return;
			}
		}
        
    	// Process the move
		var payload = {game: result[0], move: {x: x, y: y, color: color, pass: pass}};
		console.log("Attempting to process move");
		
		var oldMoveNumberForKo = payload.game.move-1;
		
		db.getQuery('history', {gameId: payload.game.gameId, move: oldMoveNumberForKo},
		function(err, result)
		{
			var oldBoardForKo = undefined;
			if (result != undefined && result[0] != undefined)
			{
				oldBoardForKo = result[0].board;
			}
			
			var moveResult = serverGameModule.processMove(payload.game, payload.move, oldBoardForKo);

			// TODO: add check, only update if game actually changes?
			db.updateGame(moveResult, function(dbresult){
				// Check if insertion ok
				if(dbresult.result.ok == 1){
					// If it is, add to the replay collection
					db.addHistory(moveResult, function(err){
						console.log("Added history to game. Error?: "+err)
					});

					//console.log(moveResult);
					//console.log("DBResult state = "+moveResult.state+", and player2 is: "+player2);

					// If AI game, call AI move function
					if(player2 == "AI" && (moveResult.state == whiteTurn || moveResult.state == blackPassed)){
						console.log("Requesting a move from the AI");
						getAIMove(moveResult, payload.move);
					}
					
					// Send user the board
					res.send(moveResult); 
					return;
				} else {
					// Failed to update db
					console.log("Failed to update DB, returning same board");
					res.send(result[0]);
					return;
				}
			}, 'games');
		});
	});
})

//
function postRoberts(param, game, callback){
		var move;

		request({
		    url: "http://roberts.seng.uvic.ca:30000/ai/attackEnemy",
		    method: "POST",
		    json: true,
		    body: param 
		}, function (error, response, body){

		if(error != null){
			// Fatal error, couldn't reach server
			move = {gameId: game.gameId, x: 0, y: 0, pass: true, ai: true};
		} else {
			// If we recieve an invalid request or something, try again one more time
			if(body == "Invalid request format." || response.statusCode == 400){
				// First call failed
				console.log("Invalid move, say its a pass");
				move = {gameId: game.gameId, x: 0, y: 0, pass: true, ai: true};
			} else {
				move = {gameId: game.gameId, x: body.x, y: body.y, pass: body.pass, ai: true};
			}
		}

		// Send request to /sendMove from AI until board state changes
		console.log("Move from AI: ");
		console.log(move);
		request({
		    url: "http://localhost:"+PORT+"/sendMove",
		    method: "POST",
		    json: true,
		    body: move 
		}, function (error, response, body){
			console.log("Sent sendMove for AI, error: "+error);
		});

	});
}

// Given a game, updates the game with a move from the AI
function getAIMove(game, move){
	// Prepare input to ajax call
	//console.log(game);
	var param = {
		'size': game.boardSize,
		'board': game.board,
		'last': {
			'x': move.x,
			'y': move.y,
			'c': move.color,
			'pass': move.pass
		}
	};
	postRoberts(param, game, function(newGame){
		console.log("Tried to update the game and history");
	});
}

// Get the status of a game
app.get('/getBoard', function (req, res) {
	gameId = req.query.id;
	db.getQuery('games', {gameId: gameId}, function(err, result){
		res.send(result);
	});
})

// Redirect all unsupported pages to the home page
app.get('*', function (req, res) {
    res.redirect('/');
});

// Listen on default port 
var server = app.listen(PORT, function () {
  console.log("Server running at 127.0.0.1.");
  db.connect(function(){console.log("Ready to serve requests.");});
})