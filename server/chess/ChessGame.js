// origin = [X1, Y1]
// dest = [X2, Y2]
// P = Pawn
// R = Rook
// N = Knight
// B = Bishop
// Q = Queen
// K = King

const isLegalMove = require('./isLegalMove');
// const moveToPGNString = require('./convertToPGN');

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
    // this.history = {};
    // this.count = 1;
    this.hasMovedWRK = false;
    this.hasMovedWRQ = false;
    this.hasMovedWK = false;
    this.hasMovedBRK = false;
    this.hasMovedBRQ = false;
    this.hasMovedBK = false;
    this.canEnPassantW = [];
    this.canEnPassantB = [];
  }

  movePiece(origin, dest) {
    let error = null;
    if (dest === undefined) {
      error = 'Attempted destination is invalid.';
      return { game: this, error };
    } else if (!origin || !this.board[origin[0]] || !this.board[origin[0]][origin[1]]) {
      error = 'Origin is invalid.';
      return { game: this, error };
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      error = 'Origin and destination cannot be the same.';
      return { game: this, error };
    } else if (this.turn !== this.board[origin[0]][origin[1]][0]) {
      error = 'Not your turn.';
      return { game: this, error };
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    if (destPiece) {
      if (originPiece[0] === destPiece[0]) {
        error = 'Cannot capture your own piece.';
        return { game: this, error };
      }
    }
    const legalMoveResult = isLegalMove(this, origin, dest);
    if (legalMoveResult.bool) {
      if (legalMoveResult.castling) {
        if (legalMoveResult.castling === 'BRQ') {
          this.board[0][3] = 'BR';
          this.board[0][0] = null;
          this.hasMovedBRQ = true;
          this.hasMovedBK = true;
        } else if (legalMoveResult.castling === 'BRK') {
          this.board[0][5] = 'BR';
          this.board[0][7] = null;
          this.hasMovedBRK = true;
          this.hasMovedBK = true;
        } else if (legalMoveResult.castling === 'WRQ') {
          this.board[7][3] = 'WR';
          this.board[7][0] = null;
          this.hasMovedWRQ = true;
          this.hasMovedWK = true;
        } else if (legalMoveResult.castling === 'WRK') {
          this.board[7][5] = 'WR';
          this.board[7][7] = null;
          this.hasMovedWRK = true;
          this.hasMovedWK = true;
        }
      }
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
      if (destPiece) {
        this.capturePiece(destPiece);
      }
      this.turn = (this.turn === 'W') ? 'B' : 'W';
      this.board[dest[0]][dest[1]] = originPiece;
      this.board[origin[0]][origin[1]] = null;
      // check for check/checkmate/stalemate
      return { game: this, error, castling: legalMoveResult.castling };
    }
    error = 'Move is not allowed.';
    return { game: this, error };
  }

  capturePiece(piece) {
    if (piece[0] === 'W') {
      this.blackCapPieces.push(piece);
    } else {
      this.whiteCapPieces.push(piece);
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
