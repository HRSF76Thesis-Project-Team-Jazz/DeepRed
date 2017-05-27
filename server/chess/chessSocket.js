module.exports = (io, client) => {
  // triggered when user picks up a chess piece and
  // attenpt to drop it to a new grid
  client.on('checkLegalMove', (data) => {
    console.log('coordinates received at server');
    console.log('coordinates: ', data);
    // check chess logic
    // return boolean result
    // client.emit();
  });
};
