// origin/dest are arrays that represent coordinates [M, N]

const isVertPathClear = (game, origin, dest, limit = 7) => {
  console.log('Origin: ', origin, game.board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, game.board[dest[0]][dest[1]]);

  for (let i = origin[0] + 1; i < dest[0]; i++) {
    console.log('Path: ', [i, origin[1]], game.board[i][origin[1]]);
    if (game.board[i][origin[1]]) {
      return false;
    }
  }
  return true;
};

const isDiagPathClear = (game, origin, dest, limit = 7) => {
  console.log('Origin: ', origin, game.board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, game.board[dest[0]][dest[1]]);
  // if destination coordinate is located below the original piece
  if (origin[0] < dest[0]) {
    let y = origin[1] - 1;
    for (let i = origin[0] + 1; i < dest[0]; i++) {
      console.log('Path: ', [i, y], game.board[i][y]);
      if (game.board[i][y]) {
        return false;
      }
      y--;
    }
  } else {
    // if destination coordinate is located above the original piece
    let y = origin[1] + 1;
    for (let i = origin[0]; i > dest[0]; i--) {
      console.log('Path: ', [i, y], game.board[i][y]);
      if (game.board[i][y]) {
        return false;
      }
      y++;
    }
  }
  return true;
};

const isLegalMovePawn = (board, origin, dest) => {
  // TODO
  return true;
};

const isLegalMoveRook = (board, origin, dest) => {
  // TODO
  return true;
};

const isLegalMoveKnight = (board, origin, dest) => {
  // TODO
  return true;
};

const isLegalMoveBishop = (board, origin, dest) => {
  // TODO
  return true;
};

const isLegalMoveQueen = (board, origin, dest) => {
  // TODO
  return true;
};

const isLegalMoveKing = (board, origin, dest) => {
  // TODO
  return true;
};

// const isKingInCheck = (board) => {
//   // TODO
//   return true;
//
// };
//
// const isCheckMate = (board) => {
//
// };
//
// const isStalemate = (board) => {
//   // TODO
//   return true;
//
// };

const isLegalMove = (game, origin, dest) => {
  const pieceType = game.board[origin[0]][origin[1]][1];
  if (pieceType === 'P') {
    return isLegalMovePawn(game, origin, dest);
  } else if (pieceType === 'R') {
    return isLegalMoveRook(game, origin, dest);
  } else if (pieceType === 'N') {
    return isLegalMoveKnight(game, origin, dest);
  } else if (pieceType === 'B') {
    return isLegalMoveBishop(game, origin, dest);
  } else if (pieceType === 'Q') {
    return isLegalMoveQueen(game, origin, dest);
  } else if (pieceType === 'K') {
    return isLegalMoveKing(game, origin, dest);
  }
  return false;
};


exports.module = isLegalMove;
