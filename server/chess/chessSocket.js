const ChessGame = require('./ChessGame');
// const chessDB = require('../chessDB');

const allGames = {};
const allRooms = [];
let roomInfo = {};
let count = 0;
let queue = [];

const createAndSaveNewGame = (room) => {
  const newGame = new ChessGame();
  allGames[room] = newGame;
};

module.exports = (io, client) => {
  let room = '';

  client.on('getAllRooms', (id) => {
    io.to(id).emit('returnAllRooms', allRooms);
  });

  client.on('createRoomAsWhite', (currentUserName, currentUserEmail, id) => {
    if (queue.length !== 0) {
      room = `room ${queue.splice(0, 1)}`;
    } else {
      room = `room ${count}`;
    }
    client.join(room, () => {
      roomInfo.room = room;
      roomInfo.playerW = currentUserName;
      roomInfo.playerWemail = currentUserEmail;
      roomInfo.playerWid = client.client.id;
      roomInfo.playerWtime = 600;
      roomInfo.playerWclicked = false;
      roomInfo.count = count;
      allRooms[count] = roomInfo;
      io.to(room).emit('createRoomAsWhiteComplete', roomInfo);
      count += 1;
      roomInfo = {};
    });
  });

  client.on('createRoomAsBlack', (currentUserName, currentUserEmail, id) => {
    if (queue.length !== 0) {
      room = `room ${queue.splice(0, 1)}`;
    } else {
      room = `room ${count}`;
    }
    client.join(room, () => {
      roomInfo.room = room;
      roomInfo.playerB = currentUserName;
      roomInfo.playerBemail = currentUserEmail;
      roomInfo.playerBid = client.client.id;
      roomInfo.playerBtime = 600;
      roomInfo.playerBclicked = false;
      roomInfo.count = count;
      allRooms[count] = roomInfo;
      io.to(room).emit('createRoomAsBlackComplete', roomInfo);
      count += 1;
      roomInfo = {};
    });
  });

  client.on('joinRoomAsWhite', (currentUserName, currentUserEmail, clientCount) => {
    client.join(allRooms[clientCount].room, () => {
      allRooms[clientCount].playerW = currentUserName;
      allRooms[clientCount].playerWemail = currentUserEmail;
      allRooms[clientCount].playerWid = client.client.id;
      allRooms[clientCount].playerWtime = 600;
      allRooms[clientCount].playerWclicked = false;
      createAndSaveNewGame(allRooms[clientCount].room);
      io.in(allRooms[clientCount].room).emit('joinRoomAsWhiteComplete', allRooms[clientCount]);
    });
  });

  client.on('joinRoomAsBlack', (currentUserName, currentUserEmail, clientCount) => {
    client.join(allRooms[clientCount].room, () => {
      allRooms[clientCount].playerB = currentUserName;
      allRooms[clientCount].playerBemail = currentUserEmail;
      allRooms[clientCount].playerBid = client.client.id;
      allRooms[clientCount].playerBtime = 600;
      allRooms[clientCount].playerBclicked = false;
      createAndSaveNewGame(allRooms[clientCount].room);
      io.in(allRooms[clientCount].room).emit('joinRoomAsBlackComplete', allRooms[clientCount]);
    });
  });

  client.on('onDisconnectBlack', (clientRoom, clientCount, currentUser) => {
    console.log('black disconnected from the game');
    io.in(clientRoom).emit('beforeDisconnect', currentUser);
    client.leave(clientRoom, () => {
      allRooms[clientCount].playerB = '';
      allRooms[clientCount].playerBemail = '';
      allRooms[clientCount].playerBid = '';
      io.in(clientRoom).emit('roomInfoUpdateOnDisconnect', allRooms[clientCount]);
      if (allRooms[clientCount].playerW === '') {
        queue.push(clientCount);
      }
    });
  });

  client.on('disconnect', () => {
    const id = client.client.id;
    for (let i = 0; i < allRooms.length; i += 1) {
      if (allRooms[i].playerBid === id) {
        io.in(allRooms[i].room).emit('beforeDisconnect', allRooms[i].playerB);
        client.leave(allRooms[i].room, () => {
          allRooms[i].playerB = undefined;
          allRooms[i].playerBemail = '';
          allRooms[i].playerBid = '';
          io.in(allRooms[i].room).emit('roomInfoUpdateOnDisconnect', allRooms[i]);
          if (allRooms[i].playerW === '') {
            queue.push(i);
          }
        });
      }
      if (allRooms[i].playerWid === id) {
        io.in(allRooms[i].room).emit('beforeDisconnect', allRooms[i].playerW);
        client.leave(allRooms[i].room, () => {
          allRooms[i].playerW = undefined;
          allRooms[i].playerWemail = '';
          allRooms[i].playerWid = '';
          io.in(allRooms[i].room).emit('roomInfoUpdateOnDisconnect', allRooms[i]);
          if (allRooms[i].playerB === '') {
            queue.push(i);
          }
        });
      }
    }
  });

  client.on('onDisconnectWhite', (clientRoom, clientCount, currentUser) => {
    console.log('white disconnected from the game');
    io.in(clientRoom).emit('beforeDisconnect', currentUser);
    client.leave(clientRoom, () => {
      allRooms[clientCount].playerW = '';
      allRooms[clientCount].playerWemail = '';
      allRooms[clientCount].playerWid = '';
      io.in(clientRoom).emit('roomInfoUpdateOnDisconnect', allRooms[clientCount]);
      if (allRooms[clientCount].playerB === '') {
        queue.push(clientCount);
      }
    });
  });

  // logic socket communications
  client.on('attemptMove', (origin, dest, selection, pieceType, clientRoom) => {
    console.log('attempted Move: ', origin, dest);
    console.log('room number: ', clientRoom);
    const newState = allGames[clientRoom].movePiece(origin, dest, pieceType);
    const { error, game, castling, enPassantCoord, pawnPromotionPiece } = newState;
    io.in(clientRoom).emit('attemptMoveResult', error, origin, dest, selection, game.turn, castling, enPassantCoord, pawnPromotionPiece, game.playerInCheck, game.winner);
  });

  client.on('checkLegalMoves', (origin, clientRoom, id) => {
    if (origin) {
      const boolBoard = allGames[clientRoom].checkAllMovesOfOrigin(origin);
      io.to(id).emit('checkLegalMovesResults', boolBoard);
    }
  });

  // control socket communications
  client.on('requestPause', (clientRoom) => {
    io.in(clientRoom).emit('requestPauseDialogBox');
  });

  client.on('rejectPauseRequest', (clientRoom) => {
    io.in(clientRoom).emit('rejectPauseRequestNotification');
  });

  client.on('handleRejectPauseRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      io.in(allRooms[clientCount].room).emit('cancelPauseNotification', allRooms[clientCount].playerB);
    } else {
      io.in(allRooms[clientCount].room).emit('cancelPauseNotification', allRooms[clientCount].playerW);
    }
  });

  client.on('agreePauseRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      allRooms[clientCount].playerBclicked = true;
    }
    if (id === allRooms[clientCount].playerWid) {
      allRooms[clientCount].playerWclicked = true;
    }
    if (allRooms[clientCount].playerBclicked === true
      && allRooms[clientCount].playerWclicked === true) {
      io.in(allRooms[clientCount].room).emit('executePauseRequest');
      allRooms[clientCount].playerBclicked = false;
      allRooms[clientCount].playerWclicked = false;
    }
  });

  client.on('requestResume', (clientRoom) => {
    io.in(clientRoom).emit('requestResumeDialogBox');
  });

  client.on('rejectResumeRequest', (clientRoom) => {
    io.in(clientRoom).emit('rejectResumeRequestNotification');
  });

  client.on('handleRejectResumeRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      io.in(allRooms[clientCount].room).emit('cancelResumeNotification', allRooms[clientCount].playerB);
    } else {
      io.in(allRooms[clientCount].room).emit('cancelResumeNotification', allRooms[clientCount].playerW);
    }
  });

  client.on('agreeResumeRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      allRooms[clientCount].playerBclicked = true;
    }
    if (id === allRooms[clientCount].playerWid) {
      allRooms[clientCount].playerWclicked = true;
    }
    if (allRooms[clientCount].playerBclicked === true
      && allRooms[clientCount].playerWclicked === true) {
      io.in(allRooms[clientCount].room).emit('executeResumeRequest');
      allRooms[clientCount].playerBclicked = false;
      allRooms[clientCount].playerWclicked = false;
    }
  });

  client.on('onSurrender', (currentUser, clientRoom) => {
    io.in(clientRoom).emit('announceSurrender', currentUser);
  });

  client.on('updateTime', (clientRoom, clientCount, timeB, timeW) => {
    allRooms[clientCount].playerBtime = timeB;
    allRooms[clientCount].playerWtime = timeW;
    io.in(clientRoom).emit('sendUpdatedTime', allRooms[clientCount]);
  });


  // messaging communications
  client.on('message', (msg, count) => {
    let user = '';
    for (let key in allRooms[count]) {
      if (allRooms[count][key] === client.id) {
        if (key === 'playerWid') {
          user = allRooms[count].playerW;
        } else {
          user = allRooms[count].playerB;
        }
      }
    }
    io.in(allRooms[count].room).emit('message', `${user}: ${msg}`);
  });
};
