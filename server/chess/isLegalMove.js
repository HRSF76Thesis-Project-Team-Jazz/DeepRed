const isVertPathClear = (board, origin, dest, limit = 7) => {
  console.log('Orig: ', origin, board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, board[dest[0]][dest[1]])
  let start = '';
  let end = '';
  let count = 0;

  if (dest[0] > origin[0]) {
    start = origin[0];
    end = dest[0];
  } else {
    start = dest[0];
    end = origin[0];
  }
  for (let i = start + 1; i < end; i += 1) {
    count += 1;
    console.log('Path: ', [i, origin[1]], board[i][origin[1]], count);
    if (board[i][origin[1]] || count >= limit) {
      return false;
    }
  }
  return true;
};

const isHorizPathClear = (board, origin, dest, limit = 7) => {
  console.log('Orig: ', origin, board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, board[dest[0]][dest[1]])
  let start = '';
  let end = '';
  let count = 0;

  if (dest[1] > origin[1]) {
    start = origin[1];
    end = dest[1];
  } else {
    start = dest[1];
    end = origin[1];
  }
  for (let i = start + 1; i < end; i += 1) {
    console.log('Path: ', [origin[0], i], board[origin[0]][i]);
    count += 1;
    if (board[origin[0]][i] || count === limit) {
      return false;
    }
  }
  return true;
};

const isDiagPathClear = (board, origin, dest, limit = 7) => {
  console.log('Origin: ', origin, board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, board[dest[0]][dest[1]]);
  // if destination coordinate is located below the original piece
  if (origin[0] < dest[0]) {
    let y = origin[1] - 1;
    for (let i = origin[0] + 1; i < dest[0]; i++) {
      console.log('Path: ', [i, y], board[i][y]);
      if (board[i][y]) {
        return false;
      }
      y--;
    }
  } else {
    // if destination coordinate is located above the original piece
    let y = origin[1] + 1;
    for (let i = origin[0]; i > dest[0]; i--) {
      console.log('Path: ', [i, y], board[i][y]);
      if (board[i][y]) {
        return false;
      }
      y++;
    }
  }
  return true;
};

const isLegalMovePawn = (board, origin, dest) => {
  if (origin[1] === dest[1]) {
    return isVertPathClear(board, origin, dest, 2);
  }
  return false;
};

const isLegalMoveRook = (board, origin, dest) => {
  if (origin[1] === dest[1]) {
    return isVertPathClear(board, origin, dest);
  } else if (origin[0] === dest[0]) {
    return isHorizPathClear(board, origin, dest);
  }
  return false;
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
  if (origin[1] === dest[1]) {
    return isVertPathClear(board, origin, dest);
  } else if (origin[0] === dest[0]) {
    return isHorizPathClear(board, origin, dest);
  }
  return false;
};

const isLegalMoveKing = (board, origin, dest) => {
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

const isLegalMove = (board, origin, dest) => {
  const pieceType = board[origin[0]][origin[1]][1];
  if (pieceType === 'P') {
    return isLegalMovePawn(board, origin, dest);
  } else if (pieceType === 'R') {
    return isLegalMoveRook(board, origin, dest);
  } else if (pieceType === 'N') {
    return isLegalMoveKnight(board, origin, dest);
  } else if (pieceType === 'B') {
    return isLegalMoveBishop(board, origin, dest);
  } else if (pieceType === 'Q') {
    return isLegalMoveQueen(board, origin, dest);
  } else if (pieceType === 'K') {
    return isLegalMoveKing(board, origin, dest);
  }
  return false;
};


exports.module = isLegalMove;
