module.exports = (io, client) => {
  // triggered when user picks up a chess piece and
  // attenpt to drop it to a new grid
  client.on('checkLegalMove', (data) => {
    client.sockets.emit(data);
  });
};
