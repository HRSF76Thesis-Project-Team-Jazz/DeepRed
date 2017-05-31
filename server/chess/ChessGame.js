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
    this.count = 1;
  }

  movePiece(origin, dest) {
    if (dest === undefined) {
      throw new Error('Attempted destination is invalid');
    } else if (!this.board[origin[0]][origin[1]]) {
      throw new Error('Origin is invalid');
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      throw new Error('Origin and destination cannot be the same');
    } else if ((this.count % 2 === 0 && this.board[origin[0]][origin[1]][0] === 'W') || (this.count % 2 === 1 && this.board[origin[0]][origin[1]][0] === 'B')) {
      throw new Error('Not your turn.');
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    if (isLegalMove(this.board, origin, dest)) {
      if (destPiece) {
        if (originPiece[0] === destPiece[0]) {
          throw new Error('Attempted to capture own piece');
        } else {
          // this.history += moveToPGNString(this.board, origin, dest, this.count);
          this.capturePiece(destPiece);
        }
      }
      this.history[this.turn] = this.history[this.turn] || [];
      this.history[this.turn].push(origin);
      this.history[this.turn].push(dest);
      if (originPiece[0] === 'B') {
        this.turn += 1;
      }
      this.count += 1;
      this.board[dest[0]][dest[1]] = originPiece;
      this.board[origin[0]][origin[1]] = null;
      // check for check/checkmate/stalemate
      // console.log('--------------', this.history);
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


  pawnPromotion(piece, origin, dest) {
    let originPiece = this.board[origin[0]][origin[1]];
    let destPiece = this.board[dest[0]][dest[1]];

    if (isLegalMove(this.board, origin, dest)){
      if (piece[0] === 'W' && origin[0] === 1){
        if (dest[0] === 0){
          destPiece = 'WQ';
          originPiece = null;
        }
      }
      if (piece[0] === 'B' && origin[0] === 6){
        if (dest[0] === 7){
          destPiece = 'BQ';
          originPiece = null;
        }
      }
      this.history[this.turn] = this.history[this.turn] || [];
      this.history[this.turn].push(origin);
      this.history[this.turn].push(dest);
      if (originPiece[0] === 'B') {
        this.turn += 1;
      }
      this.count += 1;
    }
  }

  castling(piece, origin, dest) {
    let originPiece = this.board[origin[0]][origin[1]];
    let destPiece = this.board[dest[0]][dest[1]];

    // if king and rook hasnt moved
    // king is not in Check

    if (isHorizPathClear(this.board, origin, dest, limit = 7)){
      if (piece[0] === 'W'){
        if (dest[0] == 7 && dest[1] == 0){
          this.board[7][2] = 'WK';
          this.board[7][3] = 'WR';
          originPiece = null;
          destPiece = null;
        } else if (dest[0] == 7 && dest[1] == 7){
          this.board[7][6] = 'WK';
          this.board[7][5] = 'WR';
          originPiece = null;
          destPiece = null;
        }
    } else if (piece[0] == 'B'){
        if (dest[0] == 0 && dest[1] == 0){
          this.board[0][2] = 'BK';
          this.board[0][3] = 'BR';
          originPiece = null;
          destPiece = null;
        } else if (dest[0] == 0 && dest[1] == 7){
          this.board[0][6] = 'BK';
          this.board[0][5] = 'BR';
          originPiece = null;
          destPiece = null;
        }
      }
      this.history[this.turn] = this.history[this.turn] || [];
      this.history[this.turn].push(origin);
      this.history[this.turn].push(dest);
      if (originPiece[0] === 'B') {
        this.turn += 1;
      }
      this.count += 1;
    }
  }


}


module.exports = ChessGame;
