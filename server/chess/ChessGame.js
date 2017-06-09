// origin = [X1, Y1]
// dest = [X2, Y2]
// P = Pawn
// R = Rook
// N = Knight
// B = Bishop
// Q = Queen
// K = King

const isLegalMove = require('./isLegalMove');
const endGameChecks = require('./deepRed/endGameChecks');
// const moveToPGNString = require('./convertToPGN');

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
  }

  movePiece(origin, dest, pawnPromotionValue = null) {
    const error = this.errorCheck(origin, dest);
    if (error) {
      return { game: this, error };
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    const legalMoveResult = isLegalMove(this, origin, dest);
    if (legalMoveResult.bool) {
      // prevent putting yourself in check
      const testBoard = this.board.slice(0);
      testBoard[dest[0]][dest[1]] = originPiece;
      testBoard[origin[0]][origin[1]] = null;
      if (this.turn === 'W' && endGameChecks.whiteIsChecked(testBoard)) {
        return {
          game: this,
          error: 'Cannot leave yourself in check.',
        };
      } else if (this.turn === 'B' && endGameChecks.blackIsChecked(testBoard)) {
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
      let enPassantCoord = null;
      if (legalMoveResult.enPassant) {
        enPassantCoord = this.canEnPassant;
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

      if (this.turn === 'W') {
        if (endGameChecks.isCheckmateWhite(this.board)) {
          this.winner = 'W';
        } else if (endGameChecks.isStalemateBlack(this.board)) {
          this.winner = 'D';
        } else if (endGameChecks.blackIsChecked(this.board)) {
          this.playerInCheck = 'B';
        }
      } else if (this.turn === 'B') {
        if (endGameChecks.isCheckmateBlack(this.board)) {
          this.winner = 'B';
        } else if (endGameChecks.isStalemateWhite(this.board)) {
          this.winner = 'D';
        } else if (endGameChecks.whiteIsChecked(this.board)) {
          this.playerInCheck = 'W';
        }
      }
      this.turn = (this.turn === 'W') ? 'B' : 'W';
      // console.log(this.history);
      // console.log(this.board);
      // console.log('Move piece is successful.');
      return {
        game: this,
        error: null,
        castling: legalMoveResult.castling,
        enPassantCoord,
        pawnPromotionPiece,
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

}

module.exports = ChessGame;
