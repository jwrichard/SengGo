/*
	This script will be used server side to operate the game
*/
const blackTurn = 0;
const whiteTurn = 1;
const blackPassed = 2;
const whitePassed = 3;
const blackWon = 4;
const whiteWon = 5;

const blackPlayer = 1;
const whitePlayer = 2;

// board is a 2D array, where 0 = empty, 1 = player 1 token, 
// 2 = player 2 token
// move is JSON object: {x, y, playerNumber}
module.exports.processMove = function(gameInfo, move)
{
	if ( (move.color == blackPlayer && gameInfo.state != blackTurn)
		|| (move.color == whitePlayer && gameInfo.state != whiteTurn) )
	{
		return gameInfo;
	}
	
	var board = gameInfo.board; // a reference, not a copy!
	
	var scores = {"blackPlayerScore" : parseFloat(gameInfo.player1score), "whitePlayerScore" : parseFloat(gameInfo.player2score)};
	
	if (board[move.x][move.y] == 0)
	{
		board[move.x][move.y] = move.color;
	}
	else
	{
		return gameInfo;
	}
	
	/*if (violatesKo(board, move))
	{
		return false;
	}*/
	
	checkForCaptures(board, move, scores);
	// if something is captured, there should be no way for the move to be suicide
	
	if(!isSuicide(board, move))
	{
		// Then the move succeeded!
		gameInfo.state = (gameInfo.state == blackTurn ? whiteTurn : blackTurn);
		gameInfo.player1score = scores.blackPlayerScore;
		gameInfo.player2score = scores.whitePlayerScore;
		
		console.log("black player score: " + gameInfo.player1score);
		
		return gameInfo;
	}
	else
	{
		board[move.x][move.y] = 0;
		return gameInfo;
	}
}

function isSuicide(board, move)
{
	return isArmySurrounded(board, move.x, move.y, move.color);
}

// Can modify the board
function checkForCaptures(board, move, scores)
{
	var x = move.x;
	var y = move.y;
	var player = move.color;
	var enemyPlayer = (player == blackPlayer) ? whitePlayer : blackPlayer;
	
	var adjacentIntersections = getAdjacentIntersections(board, x, y); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == enemyPlayer && isArmySurrounded(board, adjX, adjY, enemyPlayer))
		{
			removeArmy(board, adjX, adjY, enemyPlayer, scores);
		}
	}
}

// Won't modify the board
function isArmySurrounded(board, startX, startY, player)
{	
	var flaggedAsChecked = 100;

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

// Can (and will) modify the board and the scores
// Assumes that the token at [startX, startY] is surrounded!!
function removeArmy(board, startX, startY, surroundedPlayer, scores)
{
	var flaggedAsChecked = 100;
	
	var adjacentIntersections = getAdjacentIntersections(board, startX, startY); 
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] == surroundedPlayer) {
			board[startX][startY] = flaggedAsChecked;
			
			removeArmy(board, adjX, adjY, surroundedPlayer, scores);
			
			board[startX][startY] = surroundedPlayer;
		}
	}
	
	board[startX][startY] = 0;
	if (surroundedPlayer == blackPlayer)
	{
		scores.whitePlayerScore++;
	}
	else if (surroundedPlayer == whitePlayer)
	{
		scores.blackPlayerScore++;
	}
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

module.exports.calculateScore = function(gameInfo)
{
	var scores = calcScoreFromBoard(gameInfo.board);
	
	gameInfo.player1score += scores[blackPlayerScore];
	gameInfo.player2score += scores[whitePlayerScore];
}

function calcScoreFromBoard(board)
{
	for (var r = 0; r < board.length; r++)
	{
		for (var c = 0; c < board.length; c++)
		{
			playerSurroundingEmpties(board, r, c, 0, undefined);
		}
	}
	
	var blackPlayerScore = 0;
	var whitePlayerScore = 0;
	
	for (var r = 0; r < board.length; r++)
	{
		for (var c = 0; c < board.length; c++)
		{
			var token = board[r][c];
			// count scores
			// 101 = black player's captured space, 102 = white player's captured space
			if (token % 100 == blackPlayer)
			{
				blackPlayerScore++;
			}
			else if (token % 100 == whitePlayer)
			{
				whitePlayerScore++;
			}
			
			// reset board to original state
			board[r][c] = token % 100;
		}
	}
	
	return {"blackPlayerScore" : blackPlayerScore, "whitePlayerScore" : whitePlayerScore};
}

// This overwrites the board to replace empties with (player num + 100), 
// where playerNum is the player that surrounds that empty. If no one surrounds
// it, it will be overwritten as just 100 (which will then be replaced with 0 again
// in calculateScore)
function playerSurroundingEmpties(board, startX, startY)
{
	if (board[startX][startY] != 0)
	{
		return false;
	}
	
	var surroundingPlayer = playerSurroundingEmptiesRecursive(board, startX, startY, undefined);
	
	//console.log(board);
	
	if (surroundingPlayer == undefined)
	{
		return false;
	}
	else
	{		
		overwriteMarkedIntersections(board, 100, surroundingPlayer + 100);
		//console.log(board);
		return surroundingPlayer;
	}
}

// Preconditions: the intersection this is called on (the original startX and startY)
// should be an empty intersection
// Determines which player is surrounding an army of empty intersections (and returns
// undefined if nobody is)
function playerSurroundingEmptiesRecursive(board, x, y, surroundingPlayer)
{	
	var flaggedAsChecked = 100;
	
	board[x][y] = flaggedAsChecked;
	
	var adjacentIntersections = getAdjacentIntersections(board, x, y); 
	//console.log(adjacentIntersections);
	
	var stillSurrounded = true;
	
	for (var i = 0; i < adjacentIntersections.length; i++)
	{
		var adjX = adjacentIntersections[i][0];
		var adjY = adjacentIntersections[i][1];
		
		if (board[adjX][adjY] != 0 && board[adjX][adjY] != flaggedAsChecked)
		{
			if (surroundingPlayer == undefined && stillSurrounded == true )
			{
				surroundingPlayer = board[adjX][adjY];
			}
			else
			{
				if (surroundingPlayer != board[adjX][adjY])
				{
					//then this set of empty spaces is not surrounded by a single player
					stillSurrounded = false;
					surroundingPlayer = undefined;
				}
			}
		}
		else if (board[adjX][adjY] == 0)
		{
			if (playerSurroundingEmptiesRecursive(board, adjX, adjY, surroundingPlayer) == undefined)
			{
				stillSurrounded = false;
				surroundingPlayer = undefined;
				//dont return yet, because we want to mark all of the intersections as checked in this "army" of empty spaces 
			}
		}
	}
	
	return surroundingPlayer;
}

function overwriteMarkedIntersections(board, markedIndicator, overwriteNum)
{
	for (var r = 0; r < board.length; r++)
	{
		for (var c = 0; c < board.length; c++)
		{
			if (board[r][c] == markedIndicator)
			{
				board[r][c] = overwriteNum;
			}
		}
	}
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