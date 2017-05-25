const isVertPathClear = (board, origin, dest, limit = 7) => {
  console.log('Orig: ', origin, board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, board[dest[0]][dest[1]]);
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
    console.log('Path: ', [i, origin[1]], board[i][origin[1]], count);
    count += 1;
    if (board[i][origin[1]] || count === limit) {
      return false;
    }
  }
  return true;
};

const isHorizPathClear = (board, origin, dest, limit = 7) => {
  console.log('Orig: ', origin, board[origin[0]][origin[1]]);
  console.log('Dest: ', dest, board[dest[0]][dest[1]]);
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

const isDiagPathClear = (board, origin, dest) => {
  // if destination coordinate is located to the left and below the original piece
  if (dest[0] > origin[0] && dest[1] < origin[1]) {
    let y = origin[1] - 1;
    for (let i = origin[0] + 1; i < dest[0]; i += 1) {
      if (board[i][y]) {
        return false;
      }
      y -= 1;
    }
  } else if (dest[0] > origin[0] && dest[1] > origin[1]) {
    // if destination is located to the right and below the original piece
    let y = origin[1] + 1;
    for (let i = origin[0] + 1; i < dest[0]; i += 1) {
      if (board[i][y]) {
        return false;
      }
      y += 1;
    }
  } else if (dest[0] < origin[0] && dest[1] < origin[1]) {
    // if destination is located to the left and above the original piece
    let y = origin[1] - 1;
    for (let i = origin[0] - 1; i > dest[0]; i -= 1) {
      if (board[i][y]) {
        return false;
      }
      y -= 1;
    }
  } else if (dest[0] < origin[0] && dest[1] > origin[1]) {
    // if destination is located to the right and above the original piece
    let y = origin[1] + 1;
    for (let i = origin[0] - 1; i > dest[0]; i -= 1) {
      if (board[i][y]) {
        return false;
      }
      y += 1;
    }
  }
  return true;
};

const isLegalMovePawn = (board, origin, dest) => {
  const xDist = Math.abs(origin[0] - dest[0]);
  const yDist = Math.abs(origin[1] - dest[1]);
  const originPieceColor = board[origin[0]][origin[1]][0];

  if (origin[1] === dest[1]) { // vertical movement
    if (board[dest[0]][dest[1]]) {
      return false;
    }
    if (originPieceColor === 'B' && origin[0] < dest[0]) {
      if (origin[0] === 1) {
        return isVertPathClear(board, origin, dest, 2);
      }
      return isVertPathClear(board, origin, dest, 1);
    } else if (originPieceColor === 'W' && origin[0] > dest[0]) {
      if (origin[0] === 6) {
        return isVertPathClear(board, origin, dest, 2);
      }
      return isVertPathClear(board, origin, dest, 1);
    }
  } else if (xDist === 1 && yDist === 1) {
    if (board[dest[0]][dest[1]]) {
      const destPieceColor = board[dest[0]][dest[1]][0];
      if (originPieceColor === 'B' && destPieceColor === 'W' && origin[0] < dest[0]) {
        return true;
      } else if (originPieceColor === 'W' && destPieceColor === 'B' && origin[0] > dest[0]) {
        return true;
      }
    }
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
  const result = [Math.abs(origin[0] - dest[0]), Math.abs(origin[1] - dest[1])];
  return (result.includes(1) && result.includes(2));
};

const isLegalMoveBishop = (board, origin, dest) => {
  const slope = Math.abs((dest[1] - origin[1]) / (dest[0] - origin[0]));
  if (slope === 1) {
    return isDiagPathClear(board, origin, dest);
  }
  return false;
};

const isLegalMoveQueen = (board, origin, dest) => {
  const slope = Math.abs((dest[1] - origin[1]) / (dest[0] - origin[0]));
  if (origin[1] === dest[1]) {
    return isVertPathClear(board, origin, dest);
  } else if (origin[0] === dest[0]) {
    return isHorizPathClear(board, origin, dest);
  } else if (slope === 1) {
    return isDiagPathClear(board, origin, dest);
  }
  return false;
};

const isLegalMoveKing = (board, origin, dest) => {
  const xDist = Math.abs(origin[0] - dest[0]);
  const yDist = Math.abs(origin[1] - dest[1]);
  if (xDist + yDist === 1) {
    return true;
  } else if (xDist + yDist === 2) {
    return (xDist && yDist);
  }
  return false;
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


module.exports = isLegalMove;
module.exports = isDiagPathClear;
module.exports = isLegalMoveBishop;

