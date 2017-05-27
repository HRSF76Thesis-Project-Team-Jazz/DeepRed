const index = require('./index');

const io = index.io;

io.on('connect', (socket) => {
  console.log('server side socket connected!');
});
