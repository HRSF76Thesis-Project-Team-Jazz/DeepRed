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

  client.on('getAllRooms', id => {
    io.to(id).emit('returnAllRooms', allRooms);
  });

  client.on('createRoomAsWhite', (currentUserName, currentUserEmail, id) => {
    if (queue.length !== 0) {
      room = `room ${queue[0]}`;
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
      console.log('123W: ', allRooms);
      io.to(room).emit('createRoomAsWhiteComplete', roomInfo);
      count += 1;
      roomInfo = {};
    });
  });

  client.on('createRoomAsBlack', (currentUserName, currentUserEmail, id) => {
    console.log('hello: ', currentUserEmail);
    if (queue.length !== 0) {
      room = `room ${queue[0]}`;
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
      console.log('123B: ', allRooms);
      io.to(room).emit('createRoomAsBlackComplete', roomInfo);
      count += 1;
      roomInfo = {};
    });
  });

  client.on('joinRoomAsWhite', (currentUserName, currentUserEmail, clientCount, clientRoom) => {
    client.join(allRooms[clientCount].room, () => {
      // if(allRooms[clientCount].playerW === undefined && allRooms[clientCount].playerB !== undefined) {
          allRooms[clientCount].playerW = currentUserName;
          allRooms[clientCount].playerWemail = currentUserEmail;
          allRooms[clientCount].playerWid = client.client.id;
          allRooms[clientCount].playerWtime = 600;
          allRooms[clientCount].playerWclicked = false;
          createAndSaveNewGame(allRooms[clientCount].room);
          io.in(allRooms[clientCount].room).emit('joinRoomAsWhiteComplete', allRooms[clientCount]);
        // }
      });
  });

  client.on('joinRoomAsBlack', (currentUserName, currentUserEmail, clientCount, clientRoom) => {
    client.join(allRooms[clientCount].room, () => {
      // if(allRooms[clientCount].playerB === undefined && allRooms[clientCount].playerW !== undefined) {
          allRooms[clientCount].playerB = currentUserName;
          allRooms[clientCount].playerBemail = currentUserEmail;
          allRooms[clientCount].playerBid = client.client.id;
          allRooms[clientCount].playerBtime = 600;
          allRooms[clientCount].playerBclicked = false;
          createAndSaveNewGame(allRooms[clientCount].room);
          io.in(allRooms[clientCount].room).emit('joinRoomAsBlackComplete', allRooms[clientCount]);
      // }
    });
  });





  // // user socket communications
  // client.on('sendCurrentUserNameAndEmail', (currentUserName, currentUserEmail) => {
  //   currentName = currentUserName;
  //   currentEmail = currentUserEmail;

  //   // dynamically create room number
  //   const room = `room ${count}`;
  //   // if current room has no player
  //   if (roomInfo.playerW === undefined || roomInfo.playerW === '') {
  //     client.join(room, () => {
  //       // add room number and first player into current room
  //       roomInfo.room = room;
  //       roomInfo.playerW = currentName;
  //       roomInfo.playerWemail = currentEmail;
  //       roomInfo.playerWid = client.client.id;
  //       roomInfo.playerWclicked = false;
  //       roomInfo.playerWtime = 600;
  //       roomInfo.thisUserId = client.client.id;
  //       roomInfo.count = count;
  //       // create new game instance
  //       createAndSaveNewGame(room);
  //       // save to DB
  //       // chessDB.newGame({
  //       //   session_id: room,
  //       //   color: 'white',
  //       //   display: currentUser,
  //       // });
  //       //
  //       // currentUser = '';
  //       io.in(room).emit('firstPlayerJoined', roomInfo);
  //     });
  //     // if current room already has one player
  //   } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
  //     client.join(room, () => {
  //       // add second player into current room
  //       roomInfo.playerB = currentName;
  //       roomInfo.playerBemail = currentEmail;
  //       roomInfo.playerBid = client.client.id;
  //       roomInfo.playerBclicked = false;
  //       roomInfo.playerBtime = 600;
  //       roomInfo.thisUserId = client.client.id;
  //       allRooms[count] = roomInfo;
  //       io.in(room).emit('secondPlayerJoined', roomInfo);
  //       // save playerB to current game in DB
  //       // chessDB.joinGame({
  //       //   session_id: room,
  //       //   color: 'black',
  //       //   display: currentUser,
  //       // });
  //       // create new game instance
  //       createAndSaveNewGame(room);
  //       io.in(room).emit('startGame', roomInfo);
  //       // empty room info array, increament count, and ready for creating new room)
  //       roomInfo = {};
  //       count += 1;
  //     });
  //   }
  // });

  // logic socket communications
  client.on('attemptMove', (origin, dest, selection, pieceType, clientRoom) => {
    console.log('attempted Move: ', origin, dest);
    console.log('room number: ', clientRoom);
    const newState = allGames[clientRoom].movePiece(origin, dest, pieceType);
    const { error, game, castling, enPassantCoord, pawnPromotionPiece } = newState;
    io.in(clientRoom).emit('attemptMoveResult', error, origin, dest, selection, game.turn, castling, enPassantCoord, pawnPromotionPiece);
  });

  client.on('checkLegalMoves', (origin, clientRoom, id) => {
    // console.log('checkLegalMove: ', origin, dest);
    // console.log('room number: ', room);
    // const bool = isLegalMove(allGames[clientRoom], origin, dest).bool;
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

  client.on('handleRejectPauseRequest', (room, id) => {
    if (id === allRooms[room].playerBid) {
      io.in(room).emit('cancelPauseNotification', allRooms[room].playerB);
    } else {
      io.in(room).emit('cancelPauseNotification', allRooms[room].playerW);
    }
  });

  client.on('agreePauseRequest', (room, id) => {
    if (id === allRooms[room].playerBid) {
      allRooms[room].playerBclicked = true;
    }
    if (id === allRooms[room].playerWid) {
      allRooms[room].playerWclicked = true;
    }
    if (allRooms[room].playerBclicked === true && allRooms[room].playerWclicked === true) {
      io.in(room).emit('executePauseRequest');
      allRooms[room].playerBclicked = false;
      allRooms[room].playerWclicked = false;
    }
  });

  client.on('requestResume', (room) => {
    io.in(room).emit('executeResumeRequest');
  });

  client.on('updateTime', (clientRoom, clientCount, timeB, timeW) => {
    allRooms[clientCount].playerBtime = timeB;
    allRooms[clientCount].playerWtime = timeW;
    io.in(clientRoom).emit('sendUpdatedTime', allRooms[clientCount]);
  });

  // messaging communications
  client.on('message', (msg, room) => {
    let user = '';
    for (let key in allRooms[room]) {
      if (allRooms[room][key] === client.id) {
        if (key === 'playerWid') {
          user = allRooms[room].playerW;
        } else {
          user = allRooms[room].playerB;
        }
      }
    }
    io.in(room).emit('message', `${user}: ${msg}`);
  });
};
