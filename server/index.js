const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Deep red chess game is listening on port ${PORT} !`);
});

const io = require('socket.io').listen(server);

// global.allRoom = [];
// global.roomInfo = [];
// global.count = 1;

io.on('connect', (client) => {
  console.log('server side socket connected!');
  require('./chess/chessSocket.js')(io, client);
});
