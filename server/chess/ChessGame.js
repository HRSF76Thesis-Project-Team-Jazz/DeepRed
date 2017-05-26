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
      ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
    ];
    this.blackCapPieces = [];
    this.whiteCapPieces = [];
    this.turn = 1;
    this.history = {};
  }

  movePiece(origin, dest) {
    if (dest === undefined) {
      throw new Error('Attempted destination is invalid');
    } else if (origin === undefined) {
      throw new Error('Origin is invalid');
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      throw new Error('Origin and destination cannot be the same');
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    if (isLegalMove(this.board, origin, dest)) {
      if (destPiece) {
        if (originPiece[0] === destPiece[0]) {
          throw new Error('Attempted to capture own piece');
        } else {
          // this.history += moveToPGNString(this.board, origin, dest, this.count);
          this.history.count = this.history.count || '';
          this.history.count = this.history.count + origin + dest;
          if (originPiece[0] === 'B') {
            this.count += 1;
          }
          this.capturePiece(destPiece);
        }
      }
      this.board[dest[0]][dest[1]] = originPiece;
      this.board[origin[0]][origin[1]] = null;
      // check for check/checkmate/stalemate
      return this.board;
    }
    throw new Error('Attempted Move is Illegal');
  }

  capturePiece(piece) {
    if (piece[0] === 'W') {
      this.blackCapPieces.push(piece);
    } else {
      this.whiteCapPieces.push(piece);
    }
  }

}

module.exports = ChessGame;
