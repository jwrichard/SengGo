/*
	This script will be used client side to operate the game

 * Requests a new board state from the server's /data route.
*/

// Global vars to be used in all
var localBoard = null; // Our local copy of what the board is, update this when getting new board (Not sure if this needed)
var localMove = -1; // Local copy of who's move it is, update this when getting new board (Not sure if this needed)
var me = 0; // Our local Id, i.e if its player me's turn, its us!

var prevState = -1;

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

function gameOver() {
    // WHAT DO WE WANT TO SEND? var board = {"gameId": gameId, (...)
    $.post("/gameOver", board).done(function(data){
        if (data != {}) {
            console.log([data]);
            drawBoard([data]);
        }
    })
}

function getData(cb){
    $.get("/getBoard?id="+gameId, function(data, textStatus, xhr){
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
    
    $('#playerinfo-left-name').html(player1);
    $('#playerinfo-right-name').html(player2);
    $('#playerinfo-left-score').html("Score: " + player1score);
    $('#playerinfo-right-score').html("Score: " + player2score);
}

/*
*
* Navigate to previous page (button with dynamic link).
*
*/
function nextPage(game) {
    $(location).attr('href',"/replay/" + game[0].gameId + "/" + ++game[0].move);
}

/*
*
* Navigate to next page (button with dynamic link).
*
*/
function prevPage(game) {
    $(location).attr('href',"/replay/" + game[0].gameId + "/" + --game[0].move);
    
}

/*
*
* Displays which player colour made last move.
*
*/
function moveInfo(turn, moveCount) {
        switch(turn) {
            case 0:
                var blackTurn = $("#moveInfo").html("White just made a move!");
                $('div#col-mid-left').append(blackTurn).show(500);
                break;
            case 1:
                var whiteTurn = $("#moveInfo").html("Black just made a move!");
                $('div#col-mid-right').append(whiteTurn).show(500);
                break;
            case 2:
                var blackPass = $("#moveInfo").html("Black just passed!");
                $('div#col-mid-right').append(blackPass).show(500);
                break;
            case 3:
                var whitePass = $("#moveInfo").html("White just passed!");
                $('div#col-mid-left').append(whitePass).show(500);
                break;
            case 4:
                var blackWon = $("#moveInfo").html("BLACK JUST WON!!");
                $('div#col-mid-left').append(blackWon).show(500);
                break;
            case 5:
                var whiteWon = $("#moveInfo").html("WHITE JUST WON!!");
                $('div#col-mid-right').append(whiteWon).show(500);
                break;
        }  
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
function drawBoard(state, count){
  console.log("Move number: " + state[0].move);
  console.log("State number: " + state[0].state);

    /*
  if (state[0].player2 == "AI") {
      count = count;
  }
  else {
      count = count-1;
  }
  */
  
  $("#currentMove").html("Current move: " + state[0].move + "/" + count);  
    
  if (state[0].move == 1) {
      $('#glyph1').hide();
  }

  if (state[0].move == count) {
      $('#glyph2').hide();
  }
    
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
			svg.append(token);
			svg.append(click);
		}
	}

    // append the svg object to the canvas object.
    canvas.append(svg);
    
    showPlayerInfo(state[0].player1, state[0].player2, state[0].player1score, state[0].player2score);
    moveInfo(state[0].state, state[0].move);
}

function init(){
	// Do page load things here...
	console.log("Initalizing Page...."); 
	drawBoard([game]);
  setInterval(tick, 1000);
}