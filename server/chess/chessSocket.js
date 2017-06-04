const ChessGame = require('./ChessGame');
const isLegalMove = require('./isLegalMove');
const chessDB = require('../ChessDB');

const allGames = {};
const allRooms = {};
let roomInfo = {};
let count = 1;

const createAndSaveNewGame = (room) => {
  const newGame = new ChessGame();
  allGames[room] = newGame;
};

module.exports = (io, client) => {
  let currentUser = '';
  // user socket communications
  client.on('sendCurrentUserName', (currentUserName) => {
    currentUser = currentUserName; 
    // dynamically create room number
    const room = `room ${count}`;
    // if current room has no player
    if (roomInfo.playerW === undefined || roomInfo.playerW === '') {
      client.join(room, () => {
        // add room number and first player into current room
        roomInfo.room = room;
        roomInfo.playerW = currentUser;
        roomInfo.playerWid = client.client.id;
        roomInfo.playerWclicked = false;
        roomInfo.playerWtime = 600;
        // create new game instance
        createAndSaveNewGame(room);
        // save to DB
        chessDB.newGame({
          session_id: room,
          color: 'white',
          display: currentUser,
        })

        currentUser = '';
        io.in(room).emit('firstPlayerJoined', roomInfo);

      });
      // if current room already has one player
    } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
      client.join(room, () => {
        // add second player into current room
        roomInfo.playerB = currentUser;
        roomInfo.playerBid = client.client.id;
        roomInfo.playerBclicked = false;
        roomInfo.playerBtime = 600;
        allRooms[room] = roomInfo;
        io.in(room).emit('secondPlayerJoined', roomInfo);
        // save playerB to current game in DB
        chessDB.joinGame({
          session_id: room,
          color: 'black',
          display: currentUser,
        })
        // create new game instance
        createAndSaveNewGame(room);
        io.in(room).emit('startGame', roomInfo);
        // empty room info array, increament count, and ready for creating new room)
        currentUser = '';
        roomInfo = {};
        count += 1;
      });
    }
  });
//selectedPiece, 
  // logic socket communications
  client.on('attemptMove', (origin, dest, selection, room) => {
    console.log('attempted Move: ', origin, dest);
    console.log('room number: ', room);
    const newState = allGames[room].movePiece(origin, dest);
    io.in(room).emit('attemptMoveResult', newState.error, origin, dest, selection);
  });

  client.on('checkLegalMove', (origin, dest, clientRoom) => {
    // console.log('checkLegalMove: ', origin, dest);
    // console.log('room number: ', room);
    const bool = isLegalMove(allGames[clientRoom], origin, dest).bool;
    io.in(clientRoom).emit('isLegalMoveResult', dest, bool);
  });

  // control socket communications
  client.on('requestPause', clientRoom => {
    io.in(clientRoom).emit('requestPauseDialogBox');
  });

  client.on('rejectPauseRequest', clientRoom => {
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
    if (id === allRooms[room]. playerWid) {
      allRooms[room].playerWclicked = true;
    }
    if (allRooms[room].playerBclicked === true && allRooms[room].playerWclicked === true) {
      io.in(room).emit('executePauseRequest');
      allRooms[room].playerBclicked === false;
      allRooms[room].playerWclicked === false;
    }
  })

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
    io.in(room).emit('message', user + ': ' + msg);
  });
};
