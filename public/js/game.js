/*
	This script will be used client side to operate the game

 * Requests a new board state from the server's /data route.
*/

// Global vars to be used in all
var localBoard = null; // Our local copy of what the board is, update this when getting new board (Not sure if this needed)
var localMove = -1; // Local copy of who's move it is, update this when getting new board (Not sure if this needed)
var me = 0; // Our local Id, i.e if its player me's turn, its us!

/*
*	checkIfValidMove
*	Inputs: 
* 	- Board: int[] - x by x 2D array of ints representing tokens at different locations
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
*
*	Returns:
*	- IfValdMove: bool
*/ 
function checkIfValidMove(board, move){

	// Make sure spot is not taken
	// TODO

    if(board[x][y] != 0)
    {
        return false;
    }
    
	// Make sure spot would not be suicide
	// TODO

	// SERVER WILL CHECK KO RULE AFTER CHECKING IF MOVE IS VALID
	//if(checkifKo(board, move)) return false;

	// If we make it past all checks, it is a valid move
	return true;
}

/*
*	sendMove - Sends a request to the server to make their move
*			 - Should sent POST request to '/sendMove'
			 - Should send game id and move in the request body
			 - Don't need to send auth info, AJAX will forward cookies
*	Inputs: 
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
*
*	Returns: 
*	- Success: bool
*/
function sendMove(x, y){
    
	var move = {"x": x, "y": y, gameId: gameId};
    $.post("/sendMove", move).done(function(data){
    	if(data != {}){
    		console.log([data]);
    		drawBoard([data]);
    	}
    });   
}

function getData(cb){
    $.get("/getBoard?id="+gameId, function(data, textStatus, xhr){
        console.log("Response for /getBoard?id="+gameId+": "+textStatus);  
        console.log(data);

        // handle any errors here....

        // draw the board....

        localBoard = data; 

        cb(data);  

    }); 
}



/*
*	getBoard - Sends a request to the server to update the game board
*			 - Should sent GET request to '/getBoard'
*			 - Should send game id in the request
*			 
*	Returns: 
*	- An object containing the board and who's turn it is
*	- Object: {board: x by x 2D array of ints representing tokens at different locations, move: int}
*/
function getBoard(){

 // This code is going to end up doing something
 // that relates to the AI and requesting moves from it
 // similar code can be seen in script.js from lab 6 I think.
 // WYLL :D
	
    $.ajax({
        type: 'POST',
        url : '/getBoard?id='+ gameId,
        dataType: "json",
        data : JSON.stringify(localBoard), 
        contentType : "application/json",
        success : function(data){
            console.log(data);
            //console.log(status);
            localBoard = data;
            drawBoard(data);    
        }
    });

}

/*
* showPlayerInfo - Given player name and score for each player,
*                  manipulate the DOM to display each player information
*                - Player information contains: Name/Score
*
*/
function showPlayerInfo(player1, player2, player1score, player2score) {
    
    var playerLeftInfo = document.getElementById('playerinfo-left');
    var playerRightInfo = document.getElementById('playerinfo-right');
    
    var firstPlayer = document.createElement('H2');
    var secondPlayer = document.createElement('H2');
    var firstPlayerScore = document.createElement('H3');
    var secondPlayerScore = document.createElement('H3');
    var firstPlayerBtn = document.createElement("BUTTON");
    var secondPlayerBtn = document.createElement("BUTTON");
    
    firstPlayerBtn.className = "btn btn-danger";
    secondPlayerBtn.className = "btn btn-danger";
    var text1 = document.createTextNode("PASS");
    var text2 = document.createTextNode("PASS");
    firstPlayer.innerHTML = player1 + " is colour Black.";
    secondPlayer.innerHTML = player2 + " is colour White.";
    
    firstPlayerBtn.appendChild(text1);
    secondPlayerBtn.appendChild(text2);
    
    firstPlayerScore.innerHTML = "Score: " + parseInt(player1score);
    secondPlayerScore.innerHTML = "Score: " + parseInt(player2score);
    
    playerLeftInfo.appendChild(firstPlayer);
    playerLeftInfo.appendChild(firstPlayerScore);
    playerLeftInfo.appendChild(firstPlayerBtn);
    playerLeftInfo.style.textAlign = 'center';
    playerRightInfo.appendChild(secondPlayer);
    playerRightInfo.appendChild(secondPlayerScore);
    playerRightInfo.appendChild(secondPlayerBtn);
    playerRightInfo.style.textAlign = 'center';
}

/*
* passButton - Have the pass button show in the appropriate
*              context (i.e. different game modes)
*
*/
function passButton(turn) {
    // HOT SEAT PLAY/NETWORK PLAY:
        // STATE 0: show pass button for player 1 move (hide player 2 pass)
        // STATE 1: show pass button for player 2 move (hide player 1 pass)
}


function placeToken(board) {
 /*  setAttribute("onmouseover", 'setAttribute("fill-opacity", .5)');
   setAttribute("onmouseout", 'setAttribute("fill-opacity", 0)');*/
	console.log(click);
}

/*
*	drawBoard - Given a board, re-draws the page and manipulates the DOM to display the new board
*			  - Look at /views/play.html to figure out how to draw it
*
*/
function drawBoard(state){
	console.log(state[0].board);
	
	$('#canvas, #playerinfo-left, #playerinfo-right').html('');
	
    var canvas = $("#canvas"); 

    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
    var W = 750, H = W; 
    canvas.css("height", H); 
    canvas.css("width", W); 

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API. 
    var svg = $(makeSVG(W, H));
	
	
	//var sz = state.size;
	var sz = state[0].boardSize-1;
	//var board = state.board;
	var board = state[0].board;
	//console.log(board[1][1]);
	var x = W;
	var inc = (x/sz);
	var offset = (W-x)/2;
	
	if( (.5*inc) > offset) {
		offset = .5*inc;
		x = W -16 - (2*offset);
		inc = x/sz;
	}
	
	svg.append(makeRectangle(0,0,W-16,H-16,"board"));
	
	for(i=0; i<=sz; i++){
		for(j=0; j<=sz; j++){
			if( i < state[0].boardSize-1 && j < state[0].boardSize-1) {
				var rect = makeRectangle( (i*inc)+offset+1,(j*inc)+offset+1,inc-2,inc-2,"square");
				svg.append(rect);
			}
			if(board[i][j] === 0)
				var click = makeClick( (i*inc)+(1.05*offset)-1,(j*inc)+(1.05*offset)-1,inc,inc,i,j);
			if(board[i][j] === 1)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"black");
			if(board[i][j] === 2)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"white");
			//click.setAttribute("onclick",placeToken(board));
			svg.append(token);
			svg.append(click);
			//console.log(board[i][j]);
		}
	}
	//console.log(board);

    // append the svg object to the canvas object.
    canvas.append(svg);
    showPlayerInfo(state[0].player1, state[0].player2, state[0].player1score, state[0].player2score);

    // Set the game status
    switch(state[0].state){
    	case 0: $('#gameStatus').html('<b>Blacks turn</b>'); break;
    	case 1: $('#gameStatus').html('<b>Whites turn</b>'); break;
    	case 2: $('#gameStatus').html('<b>Black passed</b>'); break;
    	case 3: $('#gameStatus').html('<b>White passed</b>'); break;
    	case 4: $('#gameStatus').html('<b>Black won!</b>'); break;
    	case 5: $('#gameStatus').html('<b>White won!</b>'); break;
    }

}


/* 
*	tick - Periodically checks for game board updates if it isn't our turn
*/
function tick(){
	// If we think its the other persons turn, check for updates
	if(localMove != 0){
		getData(drawBoard);
	}
} 

setInterval(tick, 10000); // ## Uncomment when page ready
 
function init(){
	// Do page load things here...
	console.log("Initalizing Page...."); 
	getData(drawBoard);

	
}

$(document).ready(function(){
	// Add event handler for squares
	console.log('Creating event handlers for squares');
	$('rect.click').on('click', function(){
		console.log("You clicked on a square!");
	});
});