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
function sendMove(move){
    


	return false;
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
*
*/
function showPlayerInfo(player1, player2) {
    
    var playerLeftInfo = document.getElementById('playerinfo-left');
    var playerRightInfo = document.getElementById('playerinfo-right');
    
    var firstPlayer = document.createElement('H1');
    var secondPlayer = document.createElement('H1');
    var firstPlayerScore = document.createElement('H2');
    var secondPlayerScore = document.createElement('H2');
    
    firstPlayer.appendChild(player1);
    secondPlayer.appendChild(player2);
    
    firstPlayerScore.innerHTML = "Score: " + parseInt(player1score);
    secondPlayerScore.innerHTML = "Score: " + parseInt(player2score);
    
    
}


/*
*	drawBoard - Given a board, re-draws the page and manipulates the DOM to display the new board
*			  - Look at /views/play.html to figure out how to draw it
*
*/
function drawBoard(state){
	console.log(state[0].board);
	
	$('#canvas').html('');
	
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
	
	for(i=0; i<sz; i++){
		for(j=0;j<sz;j++){
			//var rect = makeRectangle( 50*i,50*j,48,48 ,"brown");
			var rect = makeRectangle( (i*inc)+offset+1,(j*inc)+offset+1,inc-2,inc-2,"square");
			/*if(board[i][j] === 0)
				var token = makeClick( (i*inc)+offset-1,(j*inc)+offset-1,inc-2,inc-2);*/
			if(board[i][j] === 1)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"black");
			if(board[i][j] === 2)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"white");
			svg.append(rect);
			svg.append(token);
			//console.log(board[i][j]);
		}
		
	}
	//console.log(board);

    // append the svg object to the canvas object.
    canvas.append(svg);

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

    // do page load things here...

    console.log("Initalizing Page...."); 
    getData(drawBoard);
    getData(showPlayerInfo);
}