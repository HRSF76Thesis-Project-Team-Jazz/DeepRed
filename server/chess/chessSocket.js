module.exports = (io, client) => {
  let allRoom = [];
  let roomInfo = [];
  let count = 1;

  let room = 'room' + count;
  console.log('room#: ', room);

  if (roomInfo.length === 0) {
    client.join(room, () => {
      roomInfo[0] = count;
      roomInfo[1] = client.id;
      io.in(room).emit('newPlayerJoined', roomInfo);
    });
  } else if (roomInfo.length === 2) {
    client.join(room, () => {
      roomInfo[2] = client.id;
      allRoom.push(roomInfo);
      io.in(room).emit('newPlayerJoined', roomInfo);
      // create a new game instance here
      roomInfo = [];
      count += 1;
    });
  }

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

