/*
	This script will be used server side to operate the game
*/

module.exports.processMove = function(board, move)
{
	board[move.x][move.y] = move.color;
	
	board = checkForCaptures(board, move);
	
	if(isValidMove(board, move))
	{
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
	/*if(violatesKo(board, move))
	{
		return false;
	}*/

	// If we make it past all checks, it is a valid move
	return true;
}

function isSuicide(board, move)
{
	return isArmySurrounded(board, move.x, move.y, move.color);
}

function checkForCaptures(board, move)
{
	var x = move.x;
	var y = move.y;
	var player = move.color;
	var enemyPlayer = player == 1 ? 2 : 1;
	
	var adjacentIntersections = getAdjacentIntersections(board, x, y); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == enemyPlayer && isArmySurrounded(board, adjX, adjY, enemyPlayer))
		{
			board = removeArmy(board, adjX, adjY, enemyPlayer);
		}
	}
	
	return board;
}

function isArmySurrounded(board, startX, startY, player)
{	
	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == 0)
		{
			return false;
		}
		else if (board[adjX][adjY] == player) {
			board[startX][startY] = 99; //mark as checked
			if(!isArmySurrounded(board, adjX, adjY, player))
			{
				board[startX][startY] = player;
				return false;
			}
			board[startX][startY] = player;
		}
	}
	
	return true;
}

function removeArmy(board, startX, startY, player)
{
	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == player) {
			board[startX][startY] = 99; //mark as checked
			
			board = removeArmy(board, adjX, adjY, player);
			
			board[startX][startY] = player;
		}
	}
	
	board[startX][startY] = 0;
	// Update other player's score?
	return board;
}

function getAdjacentIntersections(board, x, y)
{	
	var adjacentIntersections = [];
	if (x - 1 >= 0) { adjacentIntersections.push([x-1, y]) };
	if (x + 1 < board.length) { adjacentIntersections.push([x+1, y]) };
	if (y - 1 >= 0) { adjacentIntersections.push([x, y-1]) };
	if (y + 1 < board.length) { adjacentIntersections.push([x, y+1]) };
	
	return adjacentIntersections;
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