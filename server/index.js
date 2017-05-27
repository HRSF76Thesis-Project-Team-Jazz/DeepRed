const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});

const io = require('socket.io').listen(server);

module.exports.io = io;
