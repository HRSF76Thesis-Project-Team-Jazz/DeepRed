// origin = [X1, Y1]
// dest = [X2, Y2]
// P = Pawn
// R = Rook
// N = Knight
// B = Bishop
// Q = Queen
// K = King

const isLegalMove = require('./isLegalMove');

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
  }

  movePiece(origin, dest) {
    if (dest === undefined) {
      throw new Error('Attempted destination is invalid');
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      throw new Error('Origin and destination cannot be the same');
    }
    let originPiece = this.board[dest[0]][dest[1]];
    let destPiece = this.board[dest[0]][dest[1]];
    if (isLegalMove(this.board, origin, dest)) {
      if (destPiece) {
        if (originPiece[0] === destPiece[0]) {
          throw new Error('Attempted to capture own piece');
        } else {
          this.capturePiece(destPiece);
        }
      }
      destPiece = originPiece;
      originPiece = null;
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
