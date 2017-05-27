const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('Deep red chess game is listening on port ' + PORT + '!');
});

const io = require('socket.io').listen(server);
// io.on('connect', (socket) => {
//   console.log('server side socket connected!');
// });

module.exports = io;
