/*
	This script will be used server side to operate the game
*/

/*
*	checkIfValidMove
*	Inputs: 
* 	- Board: int[] - x by x 2D array of ints representing tokens at different locations
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
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
*/ 
function checkIfKo(board, move){
	// Do magic shit




	return true;
}