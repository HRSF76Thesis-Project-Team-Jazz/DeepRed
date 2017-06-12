// origin = [X1, Y1]
// dest = [X2, Y2]
// P = Pawn
// R = Rook
// N = Knight
// B = Bishop
// Q = Queen
// K = King

const isLegalMove = require('./isLegalMove');
const { isCheckmateWhite, isStalemateBlack, blackIsChecked, isCheckmateBlack,
isStalemateWhite, whiteIsChecked } = require('./deepRed/endGameChecks');
const { whiteMove, blackMove, mutateBoard } = require('./deepRed/playerVsAI');

const transcribeBoard = board => board.map((row) => {
  const pieceIndex = {
    null: 0,
    WP: 1,
    WN: 2,
    WB: 3,
    WR: 4,
    WQ: 5,
    WK: 6,
    BP: 'a',
    BN: 'b',
    BB: 'c',
    BR: 'd',
    BQ: 'e',
    BK: 'f',
  };
  const newRow = row.map(col => pieceIndex[col]);
  return newRow.join('');
}).join('');

class ChessGame {

  constructor() {
    this.board = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
    ];
    this.blackCapPieces = [];
    this.whiteCapPieces = [];
    this.turn = 'W';
    this.history = [this.board];
    this.hasMovedWRK = false;
    this.hasMovedWRQ = false;
    this.hasMovedWK = false;
    this.hasMovedBRK = false;
    this.hasMovedBRQ = false;
    this.hasMovedBK = false;
    this.canEnPassant = [];
    this.playerInCheck = null;
    this.winner = null;
    this.moveHistoryEntry = [];
  }

  movePiece(origin, dest, pawnPromotionValue = null, gameMode = 'default') {
    const error = this.errorCheck(origin, dest);
    if (error) {
      return { game: this, error };
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    const legalMoveResult = isLegalMove(this, origin, dest);
    if (legalMoveResult.bool) {
      // prevent putting yourself in check
      const testBoard = this.board.map(row => row.map(x => x));
      testBoard[dest[0]][dest[1]] = originPiece;
      testBoard[origin[0]][origin[1]] = null;
      if (this.turn === 'W' && whiteIsChecked(testBoard)) {
        return {
          game: this,
          error: 'Cannot leave yourself in check.',
        };
      } else if (this.turn === 'B' && blackIsChecked(testBoard)) {
        return {
          game: this,
          error: 'Cannot leave yourself in check.',
        };
      }

      // handle castling
      if (legalMoveResult.castling) {
        this.castlingMove(legalMoveResult.castling);
      }
      this.toggleMovedRooksOrKings(origin, originPiece);
      // handle toggling en Passant
      if (legalMoveResult.enPassant) {
        const pawn = this.board[this.canEnPassant[0]][this.canEnPassant[1]];
        this.addToCaptureArray(pawn);
        this.board[this.canEnPassant[0]][this.canEnPassant[1]] = null;
      }
      this.canEnPassant = legalMoveResult.canEnPassant || [];
      // add to capture array
      if (destPiece) {
        this.addToCaptureArray(destPiece);
      }

      // swap location
      this.board[dest[0]][dest[1]] = originPiece;
      this.board[origin[0]][origin[1]] = null;

      // handle pawn promotion
      let pawnPromotionPiece = null;
      if (pawnPromotionValue) {
        pawnPromotionPiece = originPiece[0] + pawnPromotionValue;
        this.promotePawn(originPiece, dest, pawnPromotionPiece);
      }
      // check for check/checkmate/stalemate

      this.history.push(transcribeBoard(this.board));

      this.endGameChecks();
      this.turn = (this.turn === 'W') ? 'B' : 'W';
      this.moveHistoryEntry.push(this.generateMoveHistoryEntry(origin, dest,
        destPiece, pawnPromotionValue, legalMoveResult));
      console.log(this.moveHistoryEntry);
      if (gameMode === 'AI' && !this.winner) {
        this.moveAI();
      }
      // console.log(this.history);
      // console.log(this.board);
      // console.log('Move piece is successful.');
      return {
        game: this,
        error: null,
      };
    }
    // console.log(this.board);
    // console.log(error);
    return { game: this, error: 'Move is not allowed.' };
  }

  errorCheck(origin, dest) {
    let error = null;
    if (dest === undefined) {
      error = 'Attempted destination is invalid.';
      // console.log(this.board);
      // console.log(error);
      return error;
    } else if (!origin || !this.board[origin[0]] || !this.board[origin[0]][origin[1]]) {
      error = 'Origin is invalid.';
      // console.log(this.board);
      // console.log(error);
      return error;
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      error = 'Origin and destination cannot be the same.';
      // console.log(this.board);
      // console.log(error);
      return error;
    } else if (this.turn !== this.board[origin[0]][origin[1]][0]) {
      error = 'Not your turn.';
      // console.log(this.board);
      // console.log(error);
      return error;
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    if (destPiece) {
      if (originPiece[0] === destPiece[0]) {
        error = 'Cannot capture your own piece.';
        // console.log(this.board);
        // console.log(error);
        return error;
      }
    }
    return error;
  }

  castlingMove(castlingStr) {
    if (castlingStr === 'BRQ') {
      this.board[0][3] = 'BR';
      this.board[0][0] = null;
      this.hasMovedBRQ = true;
      this.hasMovedBK = true;
    } else if (castlingStr === 'BRK') {
      this.board[0][5] = 'BR';
      this.board[0][7] = null;
      this.hasMovedBRK = true;
      this.hasMovedBK = true;
    } else if (castlingStr === 'WRQ') {
      this.board[7][3] = 'WR';
      this.board[7][0] = null;
      this.hasMovedWRQ = true;
      this.hasMovedWK = true;
    } else if (castlingStr === 'WRK') {
      this.board[7][5] = 'WR';
      this.board[7][7] = null;
      this.hasMovedWRK = true;
      this.hasMovedWK = true;
    }
  }

  toggleMovedRooksOrKings(origin, originPiece) {
    if (originPiece === 'WK' && JSON.stringify(origin) === JSON.stringify([7, 4])) {
      this.hasMovedWK = true;
    }
    if (originPiece === 'BK' && JSON.stringify(origin) === JSON.stringify([0, 4])) {
      this.hasMovedBK = true;
    }
    if (originPiece === 'WR' && JSON.stringify(origin) === JSON.stringify([7, 0])) {
      this.hasMovedWRQ = true;
    }
    if (originPiece === 'WR' && JSON.stringify(origin) === JSON.stringify([7, 7])) {
      this.hasMovedWRK = true;
    }
    if (originPiece === 'BR' && JSON.stringify(origin) === JSON.stringify([0, 0])) {
      this.hasMovedBRQ = true;
    }
    if (originPiece === 'BR' && JSON.stringify(origin) === JSON.stringify([0, 7])) {
      this.hasMovedBRK = true;
    }
  }

  addToCaptureArray(piece) {
    if (piece[0] === 'W') {
      this.blackCapPieces.push(piece);
    } else {
      this.whiteCapPieces.push(piece);
    }
  }

  promotePawn(originPiece, dest, pawnPromotionPiece) {
    if ((originPiece === 'WP' && dest[0] === 0) || (originPiece === 'BP' && dest[0] === 7)) {
      this.board[dest[0]][dest[1]] = pawnPromotionPiece;
    }
  }

  checkAllMovesOfOrigin(origin) {
    const resultBoard = [];
    for (let i = 0; i < 8; i += 1) {
      resultBoard[i] = new Array(8);
    }
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        resultBoard[i][j] = isLegalMove(this, origin, [i, j]).bool;
      }
    }
    return resultBoard;
  }

  endGameChecks() {
    if (this.turn === 'W') {
      if (isCheckmateWhite(this.board)) {
        this.winner = 'W';
      } else if (isStalemateBlack(this.board)) {
        this.winner = 'D';
      } else if (blackIsChecked(this.board)) {
        this.playerInCheck = 'B';
      } else {
        this.playerInCheck = null;
      }
    } else if (this.turn === 'B') {
      if (isCheckmateBlack(this.board)) {
        this.winner = 'B';
      } else if (isStalemateWhite(this.board)) {
        this.winner = 'D';
      } else if (whiteIsChecked(this.board)) {
        this.playerInCheck = 'W';
      } else {
        this.playerInCheck = null;
      }
    }
  }

  generateMoveHistoryEntry(origin, dest, destPiece, pawnPromotionValue, legalMoveResult) {
    let returnStr = '';
    if (legalMoveResult.castling) {
      if (legalMoveResult.castling[2] === 'Q') {
        return 'O-O-O';
      } else if (legalMoveResult.castling[2] === 'K') {
        return 'O-O';
      }
    } else if (legalMoveResult.enPassant || destPiece) {
      returnStr = `${origin} X ${dest}`;
    } else {
      returnStr = `${origin} - ${dest}`;
    }
    if (pawnPromotionValue) {
      returnStr += ` = ${pawnPromotionValue}`;
    }
    if (this.winner === 'W' || this.winner === 'B') {
      returnStr += ' #';
    } else if (this.playerInCheck) {
      returnStr += ' +';
    }
    return returnStr;
  }

  moveAI() {
    const pieceState = {
      hasMovedWK: this.hasMovedWK,
      hasMovedWKR: this.hasMovedWRK,
      hasMovedWQR: this.hasMovedWRQ,
      hasMovedBK: this.hasMovedBK,
      hasMovedBKR: this.hasMovedBRK,
      hasMovedBQR: this.hasMovedBRQ,
      canEnPassantW: this.canEnPassant,
      canEnPassantB: this.canEnPassant,
    };
    let deepRedMove;
    if (this.turn === 'W') {
      deepRedMove = whiteMove(this.board, pieceState);
    } else if (this.turn === 'B') {
      deepRedMove = blackMove(this.board, pieceState);
    }
    let deepRedOrigin;
    let deepRedDest;
    let deepRedPawnPromotionValue;
    if (Array.isArray(deepRedMove[0])) {
      deepRedOrigin = [parseInt(deepRedMove[0][0][0], 10), parseInt(deepRedMove[0][0][1], 10)];
      deepRedDest = deepRedMove[0][1];
      const deepRedCapPiece = this.board[deepRedDest[0]][deepRedDest[1]];
      if (deepRedCapPiece) {
        this.addToCaptureArray(deepRedCapPiece);
      }
    } else if (deepRedMove[0].move === 'enpassant') {
      deepRedOrigin = deepRedMove.from;
      deepRedDest = deepRedMove.to;
      deepRedPawnPromotionValue = deepRedMove.newPiece[1];
      if (this.turn === 'W') {
        this.addToCaptureArray('BP');
      } else if (this.turn === 'B') {
        this.addToCaptureArray('WP');
      }
    }
    this.movePiece(deepRedOrigin, deepRedDest, deepRedPawnPromotionValue, 'default');
    // this.board = mutateBoard(this.board, deepRedMove[0]);
    // const newState = deepRedMove[1];
    // this.hasMovedWK = newState.hasMovedWK;
    // this.hasMovedWRK = newState.hasMovedWKR;
    // this.hasMovedWRQ = newState.hasMovedWQR;
    // this.hasMovedBK = newState.hasMovedBK;
    // this.hasMovedBRK = newState.hasMovedBKR;
    // this.hasMovedBRQ = newState.hasMovedBQR;
    // this.canEnPassant = newState.canEnPassantW || newState.canEnPassantB;
    // this.turn = (this.turn === 'W') ? 'B' : 'W';
    // this.moveHistoryEntry.push(this.generateMoveHistoryEntry(deepRedOrigin, deepRedDest, deepRedCapPiece, pawnPromotionValue, legalMoveResult));
  }

}

module.exports = ChessGame;
