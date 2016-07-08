/*
	This script will be used server side to operate the game
*/

// board is a 2D array, where 0 = empty, 1 = player 1 token, 
// 2 = player 2 token
// move is JSON object: {x, y, playerNumber}
module.exports.processMove = function(gameInfo, move)
{
	var board = gameInfo.board;
	var scores = {"player1" : gameInfo.player1Score, "player2" : gameInfo.player2Score};
	
	if (board[move.x][move.y] == 0)
	{
		board[move.x][move.y] = move.color;
	}
	else
	{
		return false;
	}
	
	/*if (violatesKo(board, move))
	{
		return false;
	}*/
	
	board = checkForCaptures(board, move);
	
	if(!isSuicide(board, move))
	{
		gameInfo.board = board;
		return gameInfo;
	}
	else
	{
		return false;
	}
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
			removeArmy(board, adjX, adjY, enemyPlayer);
		}
	}
	
	return board;
}

function isArmySurrounded(board, startX, startY, player)
{	
	var flaggedAsChecked = 99;

	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == 0)
		{
			return false;
		}
		else if (board[adjX][adjY] == player) 
		{
			board[startX][startY] = flaggedAsChecked;
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
	var flaggedAsChecked = 99;
	
	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == player) {
			board[startX][startY] = flaggedAsChecked;
			
			removeArmy(board, adjX, adjY, player);
			
			board[startX][startY] = player;
		}
	}
	
	board[startX][startY] = 0;
	// Update other player's score?
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

module.exports.calculateScore = function(board)
{
	for (var r = 0; r < board.length; r++)
	{
		for (var c = 0; c < board.length; c++)
		{
			if (isArmySurrounded(board, r, c, 0, undefined))
			{
				removeArmy(board, r, c, 0, alreadyChecked);
			}
		}
	}
	
}

/*
// Preconditions: the intersection this is called on (the original startX and startY)
// should be an empty intersection
function playerSurroundingEmpties(board, startX, startY, surroundingPlayer)
{	
	var flaggedAsChecked = 99;
	
	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] != 0)
		{
			if (surroundingPlayer == undefined)
			{
				surroundingPlayer = board[adjX][adjY];
			}
			else
			{
				if (surroundingPlayer != board[adjX][adjY])
				{
					//then this set of empty spaces is not surrounded by a single player
					return false;
				}
			}
		}
		else if (board[adjX][adjY] == 0)
		{
			board[adjX][adjY] = flaggedAsChecked;
			if (playerSurroundingEmpties(board, adjX, adjY, surroundingPlayer) == surroundingPlayer)
			{
				
			}				
			board[adjX][adjY] = 0;
		}
	}
	
	return surroundingPlayer;
}
*/

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