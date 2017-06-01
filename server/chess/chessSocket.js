const ChessGame = require('./ChessGame');

const allRoom = [];
let roomInfo = [];
let count = 1;

const testGame = new ChessGame();

module.exports = (io, client) => {
  console.log('testing1');
  client.on('sendUserInfo', userInfo => {
    console.log('testing3');
    console.log('user: ', userInfo);
  })
  console.log('testing2');
  // dynamically create room number
  const room = `room${count}`;
  // if current room has no player
  if (roomInfo.length === 0) {
    client.join(room, () => {
      // add room number and first player into current room
      roomInfo[0] = room;
      roomInfo[1] = client.id;
      io.in(room).emit('firstPlayerJoined', roomInfo);
    });
    // if current room already has a player
  } else if (roomInfo.length === 2) {
    client.join(room, () => {
      // add second player into current room
      roomInfo[2] = client.id;
      allRoom.push(roomInfo);
      io.in(room).emit('secondPlayerJoined', roomInfo);
      // create new game instance
      const newGame = new ChessGame(roomInfo);
      // send important room and player information to client for future use
      io.in(room).emit('startGame', roomInfo, newGame);
      // empty room info array, increament count, and ready for creating new room)
      roomInfo = [];
      count += 1;
    });
  }

  client.on('disconnect', clientRoomInfo => {
    console.log('testing: ', clientRoomInfo);
    io.in(clientRoomInfo[0]).emit('playerLeft');
  })

  // triggered when user picks up a chess piece and
  // attenpt to drop it to a new grid
  client.on('newChessGame', () => {
    console.log('client started new game');
    // testGame = new ChessGame();
    io.emit('createdChessGame', testGame);
  });
  client.on('attemptMove', (selectedPiece, origin, dest, selection) => {
    console.log('attempted Move', origin, dest);
    const newState = testGame.movePiece(origin, dest);
    io.emit('attemptMoveResult', newState.game.board, newState.error, selectedPiece, origin, dest, selection);
  });
  client.on('checkLegalMove', (data) => {
    console.log('coordinates received at server');
    console.log('coordinates: ', data);
    // check chess logic
    // return boolean result
    // io.emit(true);
  });
};
