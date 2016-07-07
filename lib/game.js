/*
	This script will be used server side to operate the game
*/

module.exports.processMove = function(board, move)
{
	if(isValidMove(board, move))
	{
		board[move.x][move.y] = color;
		return board;
	}
	else
	{
		return false;
	}
}

/*
*	checkIfValidMove
*	Inputs: 
* 	- Board: int[] - x by x 2D array of ints representing tokens at different locations
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
*/ 
function isValidMove(board, move){
    
	// Make sure spot is not taken
	// TODO

	// Make sure spot would not be suicide
	if(isSuicide(board, move))
	{
		return false;
	}

	// Check Ko rule
	if(violatesKo(board, move))
	{
		return false;
	}

	// If we make it past all checks, it is a valid move
	return true;
}

function isSuicide(board, move)
{	
	var x = move.x;
	var y = move.y;
	var player = move.color;

	var adjacentIntersections = [];
	if (x - 1 >= 0) { adjacentIntersections.push([x-1, y]) };
	if (x + 1 < board.length) { adjacentIntersections.push([x+1, y]) };
	if (y - 1 >= 0) { adjacentIntersections.push([x, y-1]) };
	if (y + 1 < board.length) { adjacentIntersections.push([x, y+1]) };

	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == 0)
		{
			return false;
		}
		else if (board[adjX][adjY] == player) {
			isSuicide(board, {adjX, adjY, player});
		}
	}
	
	return true;
}

/*
*	checkIfKo - checks if this move will be a violation of the Ko rule, may need to lookup more about how it works
*	"Restatement of the ko rule. One may not capture just one stone, if that stone was played on the previous move, and that move also captured just one stone."
*	Inputs: 
* 	- Board: int[] - x by x 2D array of ints representing tokens at different locations
*	- Move: object - Object containing data about the moves location and token color {x: int, y: int, token: int}
*/ 
function violatesKo(board, move){
	// Do magic shit




	return true;
}