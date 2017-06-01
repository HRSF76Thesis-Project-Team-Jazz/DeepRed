const ChessGame = require('./ChessGame.js');

const allRoom = [];
let roomInfo = [];
let count = 1;

module.exports = (io, client) => {
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
    client.leave
  })

  // triggered when user picks up a chess piece and
  // attenpt to drop it to a new grid
  client.on('checkLegalMove', (data) => {
    console.log('coordinates received at server');
    console.log('coordinates: ', data);
    // check chess logic
    // return boolean result
    // io.emit(true);
  });
};

