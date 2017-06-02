const ChessGame = require('./ChessGame');
const isLegalMove = require('./isLegalMove');

const allGames = {};
const allRooms = {};
let roomInfo = {};
let count = 1;
let currentUser = '';

const createAndSaveNewGame = (room) => {
  const newGame = new ChessGame();
  allGames[room] = newGame;
};

module.exports = (io, client) => {
  client.on('sendCurrentUserName', (currentUserName) => {
    currentUser = currentUserName;
  });
  // dynamically create room number
  const room = `room ${count}`;
  // if current room has no player
  if (roomInfo.playerW === undefined || roomInfo.playerW === '') {
    client.join(room, () => {
      // add room number and first player into current room
      roomInfo.room = room;
      roomInfo.playerW = currentUser;
      // create new game instance
      createAndSaveNewGame(room);
      currentUser = '';
      io.in(room).emit('firstPlayerJoined', roomInfo);
    });
    // if current room already has one player
  } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
    client.join(room, () => {
      // add second player into current room
      roomInfo.playerB = currentUser;
      allRooms[room] = roomInfo;
      io.in(room).emit('secondPlayerJoined', roomInfo);
      // create new game instance
      createAndSaveNewGame(room);
      io.in(room).emit('startGame', roomInfo);
      // empty room info array, increament count, and ready for creating new room)
      roomInfo = {};
      count += 1;
    });
  }

  client.on('attemptMove', (selectedPiece, origin, dest, selection, room) => {
    console.log('attempted Move: ', origin, dest);
    console.log('room number: ', room);
    const newState = allGames[room].movePiece(origin, dest);
    io.in(room).emit('attemptMoveResult', newState.game.board, newState.error, selectedPiece, origin, dest, selection);
  });

  client.on('checkLegalMove', (origin, dest, room) => {
    console.log('checkLegalMove: ', origin, dest);
    console.log('room number: ', room);
    const bool = isLegalMove(allGames[room].board, origin, dest);
    io.in(room).emit('isLegalMoveResult', dest, bool);
  });

  client.on('requestPause', room => {
    io.in(room).emit('requestPauseDialogBox');
  });
};

