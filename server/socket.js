const io = require('./index').io;

io.on('connect', (socket) => {
  console.log('server side socket connected!', socket);
});
