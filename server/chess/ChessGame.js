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
      console.log(this.board);
      console.log(error);
      return { game: this, error };
    } else if (!origin || !this.board[origin[0]] || !this.board[origin[0]][origin[1]]) {
      error = 'Origin is invalid.';
      console.log(this.board);
      console.log(error);
      return { game: this, error };
    } else if (origin[0] === dest[0] && origin[1] === dest[1]) {
      error = 'Origin and destination cannot be the same.';
      console.log(this.board);
      console.log(error);
      return { game: this, error };
    } else if (this.turn !== this.board[origin[0]][origin[1]][0]) {
      error = 'Not your turn.';
      console.log(this.board);
      console.log(error);
      return { game: this, error };
    }
    const originPiece = this.board[origin[0]][origin[1]];
    const destPiece = this.board[dest[0]][dest[1]];
    if (destPiece) {
      if (originPiece[0] === destPiece[0]) {
        error = 'Cannot capture your own piece.';
        console.log(this.board);
        console.log(error);
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
        } else if (legalMoveResult.castling === 'BRQ') {
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
        // if (originPiece[0] === destPiece[0]) {
        //   error = 'Cannot capture your own piece.';
        //   console.log(this.board);
        //   console.log(error);
        //   return { game: this, error };
        // }
        // this.history += moveToPGNString(this.board, origin, dest, this.count);
        this.capturePiece(destPiece);
      }
      // this.history[this.turn] = this.history[this.turn] || [];
      // this.history[this.turn].push(origin);
      // this.history[this.turn].push(dest);
      // if (originPiece[0] === 'B') {
      //   this.turn += 1;
      // }
      this.turn = (this.turn === 'W') ? 'B' : 'W';
      this.board[dest[0]][dest[1]] = originPiece;
      this.board[origin[0]][origin[1]] = null;
      // check for check/checkmate/stalemate
      // console.log('--------------', this.history);
      console.log('Move piece is successful');
      console.log(this.board);
      return { game: this, error };
    }
    error = 'Move is not allowed.';
    console.log(this.board);
    console.log(error);
    return { game: this, error };
  }

  capturePiece(piece) {
    if (piece[0] === 'W') {
      this.blackCapPieces.push(piece);
    } else {
      this.whiteCapPieces.push(piece);
    }
  }


  // pawnPromotion(piece, origin, dest) {
  //   let originPiece = this.board[origin[0]][origin[1]];
  //   let destPiece = this.board[dest[0]][dest[1]];
  //
  //   if (isLegalMove(this.board, origin, dest)) {
  //     if (piece[0] === 'W' && origin[0] === 1) {
  //       if (dest[0] === 0) {
  //         destPiece = 'WQ';
  //         originPiece = null;
  //       }
  //     }
  //     if (piece[0] === 'B' && origin[0] === 6) {
  //       if (dest[0] === 7) {
  //         destPiece = 'BQ';
  //         originPiece = null;
  //       }
  //     }
  //     this.history[this.turn] = this.history[this.turn] || [];
  //     this.history[this.turn].push(origin);
  //     this.history[this.turn].push(dest);
  //     if (originPiece[0] === 'B') {
  //       this.turn += 1;
  //     }
  //     this.count += 1;
  //   }
  // }
  //
  // castling(piece, origin, dest) {
  //   let originPiece = this.board[origin[0]][origin[1]];
  //   let destPiece = this.board[dest[0]][dest[1]];
  //
  //   // if king and rook hasnt moved
  //   // king is not in Check
  //
  //   if (isHorizPathClear(this.board, origin, dest, limit = 7)) {
  //     if (piece[0] === 'W') {
  //       if (dest[0] == 7 && dest[1] == 0) {
  //         this.board[7][2] = 'WK';
  //         this.board[7][3] = 'WR';
  //         originPiece = null;
  //         destPiece = null;
  //       } else if (dest[0] === 7 && dest[1] === 7) {
  //         this.board[7][6] = 'WK';
  //         this.board[7][5] = 'WR';
  //         originPiece = null;
  //         destPiece = null;
  //       }
  //     } else if (piece[0] === 'B') {
  //       if (dest[0] === 0 && dest[1] === 0) {
  //         this.board[0][2] = 'BK';
  //         this.board[0][3] = 'BR';
  //         originPiece = null;
  //         destPiece = null;
  //       } else if (dest[0] === 0 && dest[1] === 7) {
  //         this.board[0][6] = 'BK';
  //         this.board[0][5] = 'BR';
  //         originPiece = null;
  //         destPiece = null;
  //       }
  //     }
  //     this.history[this.turn] = this.history[this.turn] || [];
  //     this.history[this.turn].push(origin);
  //     this.history[this.turn].push(dest);
  //     if (originPiece[0] === 'B') {
  //       this.turn += 1;
  //     }
  //     this.count += 1;
  //   }
  // }
  //

}

module.exports = ChessGame;
