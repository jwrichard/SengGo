/*
	This script will be used client side to operate the game
*/
window.onload = function()
{
	drawBoard();
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