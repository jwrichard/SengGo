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

/* 
 * Input: gameInfo is an object as defined in server.js - will contain a board field and a scores field
 *		  move is an object of the form {x : x, y : y, color : tokenColor}
 * 
 * Output: Processes the move and returns the updated gameInfo, which will have an updated
 * 		   board and scores. If the move is invalid, it will just return an unchanged gameInfo
 */
module.exports.processMove = function(gameInfo, move)
{
	if ( (move.color == blackPlayer && (gameInfo.state != blackTurn && gameInfo.state != whitePassed))
		|| (move.color == whitePlayer && (gameInfo.state != whiteTurn && gameInfo.state != blackPassed)) )
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
	
	checkForCaptures_M(board, move, scores);
	// if something is captured, there should be no way for the move to be suicide
	
	if(!isSuicide(board, move))
	{
		// Then the move succeeded!
		//gameInfo.state = (gameInfo.state == blackTurn ? whiteTurn : blackTurn);
        if(gameInfo.state == blackTurn)
        {
            gameInfo.state = whiteTurn;
        }
        else if(gameInfo.state == blackPassed)
        {
            gameInfo.state = blackTurn;
        }
        else if(gameInfo.state == whitePassed)
        {
            gameInfo.state = whiteTurn;
        }
        else if(gameInfo.state == whiteTurn)
        {
            gameInfo.state = blackTurn;
        }
		gameInfo.player1score = scores.blackPlayerScore;
		gameInfo.player2score = scores.whitePlayerScore;
		
		return gameInfo;
	}
	else
	{
		board[move.x][move.y] = 0;
		return gameInfo;
	}
}

/* 
 * Input: A 2D array representing a board, and a move as defined in the processMove comment
 * 
 * Output: True if the move is a suicide, false otherwise
 */
function isSuicide(board, move)
{
	return isArmySurrounded(board, move.x, move.y, move.color);
}

/* 
 * Input: A 2D array board, a move object, and a scores object representing the current score
 * 
 * Output: Modifies the board to remove any tokens that were captured as a result of the move.
 * 		   Updates the scores appropriately. Note that the objects sent as arguments from the
 *		   calling function will be modified directly
 */
function checkForCaptures_M(board, move, scores)
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
		
		if (board[adjX][adjY] == enemyPlayer && isArmySurrounded(board, adjX, adjY))
		{
			removeArmy(board, adjX, adjY, enemyPlayer, scores);
		}
	}
}

/*
 * Input: A 2D array representing the board, and a starting X and Y position
 *
 * Output: Returns true if the army containing the token at [startX, startY] is surrounded by the opposite team
 */
function isArmySurrounded(board, startX, startY)
{	
	var player = board[startX][startY];

	var returnVal = isArmySurroundedInternal(board, startX, startY, player);
	overwriteMarkedIntersections(board, 100, player); //Because isArmySurroundedInternal flags spaces as checked, but cannot revert them 
													  //(otherwise we end up with infinite loops, if you are checking an army that is a big blob of tokens)
	return returnVal;
}

/*
 * Recursive function for determining if an army is surrounded
 */
function isArmySurroundedInternal(board, startX, startY, player)
{	
	var flaggedAsChecked = 100;
	board[startX][startY] = flaggedAsChecked;

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
			if(!isArmySurroundedInternal(board, adjX, adjY, player))
			{
				return false;
			}
		}
	}
	
	return true;
}

/*
 * Input: board, starting X and Y position, the player colour who is surrounded, and the current scores
 *
 * Preconditions: The token at [startX, startY] is of colour surroundedPlayer, and is actually surrounded!
 *
 * Output: Updates the board to remove the surrounded army
 */
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

/*
 * Input: A board, an x position and a y position
 *
 * Output: An array of the intersections on the board adjacent to [x, y]
 */
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
 * Input: A gameInfo object, in the format stored in the database
 *
 * Output: Modifies the object to update the scores as if the game had ended
 */
module.exports.calculateScore = function(gameInfo)
{
	var scores = calcScoreFromBoard(gameInfo.board);
	
	var blackOriginalScore = parseFloat(gameInfo.player1score);
	var whiteOriginalScore = parseFloat(gameInfo.player2score);
	
	gameInfo.player1score = blackOriginalScore + scores.blackPlayerScore;
	gameInfo.player2score = whiteOriginalScore + scores.whitePlayerScore;
}

/* 
 * Input: A go board, in the form of a 2D array, where each index represents an intersection.
 *		  The mapping of integer values to token colours is defined at the top of this file.
 *
 * Output: The score of the game based on the territory owned by each player,
 *		   in the following format: {blackPlayerScore : blackPlayerScore, whitePlayerScore: whitePlayerScore}
 */
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
			
			// this will fill "owned" territory with the tokens of the owning player
			// may want to change this?
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
	
	if (surroundingPlayer == undefined)
	{
		return false;
	}
	else
	{		
		overwriteMarkedIntersections(board, 100, surroundingPlayer + 100);
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

/*
 * Input: A board, a number indicating a marked intersection, and a number indicating what 
 *		  they should be overwritten with
 *
 * Output: Modifies the board to overwrite all intersections of value markedIndicator to 
 *		   the value overwriteNum
 */
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