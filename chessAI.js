$(document).ready(function(){
	$('#gameover').hide()
	var board,
	  game = new Chess();


	var removeGreySquares = function() {
		$('#board .square-55d63').css('background', '');
	};


	var greySquare = function(square) {
	  var squareEl = $('#board .square-' + square);
	  
	  var background = '#a9a9a9';
	  if (squareEl.hasClass('black-3c85d') === true) {
	    background = '#696969';
	  }

	  squareEl.css('background', background);
	};


	// do not pick up pieces if the game is over
	// only pick up pieces for White
	var onDragStart = function(source, piece, position, orientation) {
	  if (game.in_checkmate() === true || game.in_draw() === true || game.game_over() === true ) {
	  	$('#gameover').show();
	  	$("#gameover").html('Game over!');
	    return false;
	  }
	};


	// uses the minimax algorithm with alpha beta pruning to caculate the best move
	var calculateBestMove = function() {

	    var newGameMoves = game.moves();
	    var bestMove = -9999;
	    var bestMoveFound;

	    for(var i = 0; i < newGameMoves.length; i++) {
	        var newGameMove = newGameMoves[i]
	        game.move(newGameMove);
	        var value = minimax(1, false);
	        game.undo();
	        if(value >= bestMove) {
	            bestMove = value;
	            bestMoveFound = newGameMove;
	        }
	    }
	    return bestMoveFound;
	};


	var minimax = function (depth, isMaximisingPlayer) {
	    if (depth === 0) {
	        return -evaluateBoard(game.board());
	    }

	    var newGameMoves = game.moves();

	    if (isMaximisingPlayer) {
	        var bestMove = -9999;
	        for (var i = 0; i < newGameMoves.length; i++) {
	            game.move(newGameMoves[i]);
	            bestMove = Math.max(bestMove, minimax(depth - 1, !isMaximisingPlayer));
	            game.undo();
	        }
	        return bestMove;

	    } else {
	        var bestMove = 9999;
	        for (var i = 0; i < newGameMoves.length; i++) {
	            game.move(newGameMoves[i]);
	            bestMove = Math.min(bestMove, minimax(depth - 1, !isMaximisingPlayer));
	            game.undo();
	        }
	        return bestMove;
	    }
	};


	// the evaluation function for minimax
	var evaluateBoard = function (board) {
	    var totalEvaluation = 0;
	    for (var i = 0; i < 8; i++) {
	        for (var j = 0; j < 8; j++) {
	            totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
	        }
	    }
	    return totalEvaluation;
	};


	var getPieceValue = function (piece) {
	    if (piece === null) {
	        return 0;
	    }
	    var getAbsoluteValue = function (piece, isWhite) {
	        if (piece.type === 'p') {
	            return (isWhite ? 10 : -10);
	        } else if (piece.type === 'r') {
	            return (isWhite ? 50 : -50);
	        } else if (piece.type === 'n') {
	            return (isWhite ? 30 : -30);
	        } else if (piece.type === 'b') {
	            return (isWhite ? 30 : -30);
	        } else if (piece.type === 'q') {
	            return (isWhite ? 90 : -90);
	        } else if (piece.type === 'k') {
	            return (isWhite ? 900 : -900);
	        }
	        throw "Error: Unknown piece type given: " + piece.type;
	    };

	    return absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
	};


	var makeAImove = function () {
	    var bestMove = calculateBestMove();
	    game.move(bestMove);
	    board.position(game.fen());
	};


	var onDrop = function(source, target) {
  	  removeGreySquares();

	  // see if the move is legal
	  var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' 
	  });

	  // illegal move
	  if (move === null) return 'snapback';

	  // make legal move for black AI player
	  window.setTimeout(makeAImove, 250);
	};


	var onMouseoverSquare = function(square, piece) {
	  // get list of possible moves for this square
	  var moves = game.moves({
	    square: square,
	    verbose: true
	  });

	  // exit if there are no moves available for this square
	  if (moves.length === 0) return;

	  // highlight the square they moused over
	  greySquare(square);

	  // highlight the possible squares for this piece
	  for (var i = 0; i < moves.length; i++) {
	    greySquare(moves[i].to);
	  }
	};


	var onMouseoutSquare = function(square, piece) {
	  removeGreySquares();
	};


	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
	  board.position(game.fen());
	};

	var cfg = {
	  draggable: true,
	  position: 'start',
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onMouseoutSquare: onMouseoutSquare,
  	  onMouseoverSquare: onMouseoverSquare,
	  onSnapEnd: onSnapEnd
	};
	board = ChessBoard('board', cfg);
});