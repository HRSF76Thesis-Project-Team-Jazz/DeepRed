const ChessGame = require('./ChessGame');
const chessDB = require('../chessDB');

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
      room = `room ${queue[0]}`;
    } else {
      room = `room ${count}`;
  let currentName = '';
  let currentEmail = '';
  // user socket communications
  client.on('sendCurrentUserNameAndEmail', (currentUserName, currentUserEmail) => {
    currentName = currentUserName;
    currentEmail = currentUserEmail;

    // dynamically create room number
    const room = `room ${count}`;
    // if current room has no player
    if (roomInfo.playerW === undefined || roomInfo.playerW === '') {
      client.join(room, () => {
        // add room number and first player into current room
        roomInfo.room = room;
        roomInfo.playerW = currentName;
        roomInfo.playerWemail = currentEmail;
        roomInfo.playerWid = client.client.id;
        roomInfo.playerWclicked = false;
        roomInfo.playerWtime = 600;
        roomInfo.thisUserId = client.client.id;
        // create new game instance
        createAndSaveNewGame(room);
        // save to DB
        chessDB.newGame({
          session_id: room,
          color: 'white',
          display: currentName,
        });
        
        io.in(room).emit('firstPlayerJoined', roomInfo);
      });
      // if current room already has one player
    } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
      client.join(room, () => {
        // add second player into current room
        roomInfo.playerB = currentName;
        roomInfo.playerBemail = currentEmail;
        roomInfo.playerBid = client.client.id;
        roomInfo.playerBclicked = false;
        roomInfo.playerBtime = 600;
        roomInfo.thisUserId = client.client.id;
        allRooms[room] = roomInfo;
        io.in(room).emit('secondPlayerJoined', roomInfo);
        // save playerB to current game in DB
        chessDB.joinGame({
          session_id: room,
          color: 'black',
          display: currentName,
        });
        // create new game instance
        createAndSaveNewGame(room);
        io.in(room).emit('startGame', roomInfo);
        // empty room info array, increament count, and ready for creating new room)
        roomInfo = {};
        count += 1;
      });

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
      room = `room ${queue[0]}`;
    } else {
      room = `room ${count}`;

  let currentName = '';
  let currentEmail = '';
  // user socket communications
  client.on('sendCurrentUserNameAndEmail', (currentUserName, currentUserEmail) => {
    currentName = currentUserName;
    currentEmail = currentUserEmail;

    // dynamically create room number
    const room = `room ${count}`;
    // if current room has no player
    if (roomInfo.playerW === undefined || roomInfo.playerW === '') {
      client.join(room, () => {
        // add room number and first player into current room
        roomInfo.room = room;
        roomInfo.playerW = currentName;
        roomInfo.playerWemail = currentEmail;
        roomInfo.playerWid = client.client.id;
        roomInfo.playerWclicked = false;
        roomInfo.playerWtime = 600;
        roomInfo.thisUserId = client.client.id;
        // create new game instance
        createAndSaveNewGame(room);
        // save to DB
        chessDB.newGame({
          session_id: room,
          color: 'white',
          display: currentName,
        });
        
        io.in(room).emit('firstPlayerJoined', roomInfo);
      });
      // if current room already has one player
    } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
      client.join(room, () => {
        // add second player into current room
        roomInfo.playerB = currentName;
        roomInfo.playerBemail = currentEmail;
        roomInfo.playerBid = client.client.id;
        roomInfo.playerBclicked = false;
        roomInfo.playerBtime = 600;
        roomInfo.thisUserId = client.client.id;
        allRooms[room] = roomInfo;
        io.in(room).emit('secondPlayerJoined', roomInfo);
        // save playerB to current game in DB
        chessDB.joinGame({
          session_id: room,
          color: 'black',
          display: currentName,
        });
        // create new game instance
        createAndSaveNewGame(room);
        io.in(room).emit('startGame', roomInfo);
        // empty room info array, increament count, and ready for creating new room)
        roomInfo = {};
        count += 1;
      });

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

  // logic socket communications
  client.on('attemptMove', (origin, dest, selection, pieceType, clientRoom) => {
    console.log('attempted Move: ', origin, dest);
    console.log('room number: ', clientRoom);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

    const newState = allGames[clientRoom].movePiece(origin, dest, pieceType);
=======
    const newState = allGames[clientRoom].movePiece(origin, dest, pieceType, clientRoom);
>>>>>>> working on DB schema func
    const { error, game, castling, enPassantCoord, pawnPromotionPiece } = newState;
<<<<<<< HEAD
    io.in(clientRoom).emit('attemptMoveResult', error, origin, dest, selection, game.turn, castling, enPassantCoord, pawnPromotionPiece, game.playerInCheck, game.winner);

=======
=======
>>>>>>> working on DB schema func
    const newState = allGames[clientRoom].movePiece(origin, dest, clientRoom);
    io.in(clientRoom).emit('attemptMoveResult', newState.error, origin, dest, selection, newState.game.turn);
>>>>>>> working on DB schema func
=======

    const newState = allGames[clientRoom].movePiece(origin, dest);
    io.in(clientRoom).emit('attemptMoveResult', newState.error, origin, dest, selection, newState.game.turn, newState.castling);

>>>>>>> working on DB schema func
=======

    const newState = allGames[clientRoom].movePiece(origin, dest, clientRoom);

    io.in(clientRoom).emit('attemptMoveResult', newState.error, origin, dest, selection, newState.game.turn, newState.castling);

>>>>>>> working on DB schema func
=======
    io.in(clientRoom).emit('attemptMoveResult', error, origin, dest, selection, game.turn, castling, enPassantCoord, pawnPromotionPiece);

>>>>>>> working on DB schema func
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
    if (allRooms[clientCount].playerBclicked === true && allRooms[clientCount].playerWclicked === true) {
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
