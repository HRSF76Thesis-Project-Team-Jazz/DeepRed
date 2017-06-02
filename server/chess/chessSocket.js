const ChessGame = require('./ChessGame');
const allGames = {};
const allRooms = {};
let roomInfo = {};
let count = 1;
let currentUser = '';

// const testGame = new ChessGame();

module.exports = (io, client) => {
  client.on('sendCurrentUserName', currentUserName => {
    currentUser = currentUserName;
  })
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
    // if current room already has a player
  } else if (roomInfo.playerB === undefined || roomInfo.playerB === '') {
      client.join(room, () => {
        // add second player into current room
        roomInfo.playerB = currentUser;
        allRooms[room] = roomInfo;
        io.in(room).emit('secondPlayerJoined', roomInfo);
        // create new game instance
        createAndSaveNewGame(room);
        io.in(room).emit('startGame', roomInfo, allGames[room]);
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
  client.on('checkLegalMove', (selectedPiece, origin, dest, selection, room) => {
    console.log('checkLegalMove: ', origin, dest);
    console.log('room number: ', room);
    const bool = allGames[room].isLegalMove(allGames[room], origin, dest);
    io.in(room).emit('attemptMoveResult', dest, bool);
  });
};

const createAndSaveNewGame = room => {
  const newGame = new ChessGame();
  allGames[room] = newGame;
}
