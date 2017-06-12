// const should = require('should');
// const io = require('socket.io-client');
// const serverio = require('../test/socket.spec');

// const socketUrl = 'http://localhost:3000';

// const options = {
//   transports: ['websocket'],
//   'force new connection': true,
// };

// const user1 = { name: 'Ryan' };
// const user2 = { name: 'Carlo' };
// const user3 = { name: 'Jason' };
// const user4 = { name: 'Shawn' };

// const allRooms = [
//   { room: 'room 1',
//     playerB: 'shawn',

//   },
//   { room: 'room 2',
//     playerW: 'ryan',
//   },
// ];

// describe('socket.io', () => {
//   it('should notify user when server side socket connection is on ', (done) => {
//     const client1 = io.connect(socketUrl, options);
//     client1.emit('getAllRooms', 0);

//     client1.on('returnAllRooms', (rooms) => {
//       console.log('hi');
//       rooms.should.equal(allRooms);
//       done();
//     });
//   });
// });
