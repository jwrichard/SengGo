/*
	This script will be used client side to operate the game

 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server..
 */
function getData(cb){
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);  

        // handle any errors here....

        // draw the board....
        cb(data);  

    }); 
}

// Global vars to be used in all
var localBoard = []; // Our local copy of what the board is, update this when getting new board (Not sure if this needed)
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

	// Check Ko rule
	if(checkifKo(board, move)) return false;

	// If we make it past all checks, it is a valid move
	return true;
}

/*
*	checkIfKo - checks if this move will be a violation of the Ko rule, may need to lookup more about how it works
*	"Restatement of the ko rule. One may not capture just one stone, if that stone was played on the previous move, and that move also captured just one stone."
*	Inputs: 
* 	- Board: int[] - x by x 2D array of ints representing tokens at different locations
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
*	
*	Returns: 
*	- IfKoRuleViolated: bool
*/

function checkIfKo(board, move){
	// Do magic shit

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

	// Make AJAX call to /getBoard 

	// Parse result for game board and move

	// Update our local vars
	localBoard = board;
	localMove = move;

	// Create object and return it
	return {board: board, move: move};
}


/*
*	drawBoard - Given a board, re-draws the page and manipulates the DOM to display the new board
			  - Look at /views/play.html to figure out how to draw it
*
*/
function drawBoard(board){
	
    var canvas = $("#canvas"); 

    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
    var W = 600, H = 600; 
    canvas.css("height", H); 
    canvas.css("width", W); 

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API. 
    var svg = $(makeSVG(W, H));
	
	
	var sz = state.size;
	var board = state.board;
	var x = 650;
	var inc = (x/sz);
	var offset = (600-x)/2;
	
	if( (.5*inc) > offset) {
		offset = .5*inc;
		x = 600 - (2*offset);
		inc = x/sz;
	}
	
	svg.append(makeRectangle(0,0,600,600,"saddlebrown"));
	
	for(i=0; i<sz; i++){
		for(j=0;j<sz;j++){
			//var rect = makeRectangle( 50*i,50*j,48,48 ,"brown");
			var rect = makeRectangle( (i*inc)+offset+1,(j*inc)+offset+1,inc-2,inc-2,"darkolivegreen");
			if(board[i][j] === 1)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"palegoldenrod");
			if(board[i][j] === 2)
				var token = makeCircle( (i*inc)+offset-1,(j*inc)+offset-1,.48*(inc),"sandybrown");
			svg.append(rect);
			svg.append(token);
			//console.log(board[i][j]);
		}
		
	}
	console.log(state);

    // append the svg object to the canvas object.
    canvas.append(svg);

}


/* 
*	tick - Periodically checks for game board updates if it isn't our turn
*/
function tick(){
	// If we think its the other persons turn, check for updates
	if(localMove != 0){
		drawBoard(getBoard());
	}
} 

// setInterval(tick, 10000); // ## Uncomment when page ready