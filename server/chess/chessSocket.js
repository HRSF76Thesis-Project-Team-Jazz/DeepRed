const ChessGame = require('./ChessGame');
const chessDB = require('../chessDB');
const { simulateGamesAIvAI, simulateWinningGameAIvAI } = require('./gameSimulation/gamePlayAIvAI');
const { getAllMoves, getMovesFromDB } = chessDB;
const { encodeWithState } = require('./chessEncode');

const allGames = {};
const allRooms = [];
let roomInfo = {};
let count = 0;
const queue = [];

const createAndSaveNewGame = (room) => {
  const newGame = new ChessGame();
  allGames[room] = newGame;
};

module.exports = (io, client) => {
  let room = '';

  client.on('getAllRooms', (id) => {
    io.to(id).emit('returnAllRooms', allRooms);
  });

  client.on('createRoomAsWhite', (currentUserName, currentUserEmail, id, gameMode) => {
    if (queue.length !== 0) {
      room = `room ${queue.splice(0, 1)}`;
    } else {
      room = `room ${count}`;
    }
    client.join(room, () => {
      roomInfo.room = room;
      roomInfo.playerW = currentUserName;
      roomInfo.playerWemail = currentUserEmail;
      roomInfo.playerWid = client.client.id;
      roomInfo.playerWtime = 600;
      roomInfo.playerWclicked = false;
      createAndSaveNewGame(room);
      const num = parseInt(room[room.length - 1], 10);
      if (count !== num) {
        count = num;
      }
      roomInfo.count = count;
      allRooms[count] = roomInfo;
      io.emit('updateAllRooms', allRooms, allRooms[count]);
      io.to(room).emit('createRoomCompleted', roomInfo, allRooms);
      if (gameMode === 'AI') {
        roomInfo.playerB = 'AI';
        roomInfo.playerBemail = 'AI@AI';
        roomInfo.playerBid = 12345;
        roomInfo.playerBtime = 600;
        roomInfo.playerBclicked = false;
        io.in(room).emit('joinRoomCompleted', roomInfo, allRooms);
        io.emit('updateAllRooms', allRooms, allRooms[count]);
      }
      count += 1;
      roomInfo = {};
    });
  });

  client.on('createRoomAsWhite', (currentUserName, currentUserEmail, id, gameMode) => {
    if (queue.length !== 0) {
      room = `room ${queue.splice(0, 1)}`;
    } else {
      room = `room ${count}`;
    }
    client.join(room, () => {
      roomInfo.room = room;
      roomInfo.playerW = currentUserName;
      roomInfo.playerWemail = currentUserEmail;
      roomInfo.playerWid = client.client.id;
      roomInfo.playerWtime = 600;
      roomInfo.playerWclicked = false;
      createAndSaveNewGame(room);
      const num = parseInt(room[room.length - 1], 10);
      if (count !== num) {
        count = num;
      }
      roomInfo.count = count;
      allRooms[count] = roomInfo;
      io.emit('updateAllRooms', allRooms, allRooms[count]);
      io.to(room).emit('createRoomCompleted', roomInfo, allRooms);
      if (gameMode === 'AI') {
        roomInfo.playerB = 'AI';
        roomInfo.playerBemail = 'AI@AI';
        roomInfo.playerBid = 12345;
        roomInfo.playerBtime = 600;
        roomInfo.playerBclicked = false;
        io.in(room).emit('joinRoomCompleted', roomInfo, allRooms);
        io.emit('updateAllRooms', allRooms, allRooms[count]);
        getAllMoves('B', (res) => {
          io.in(room).emit('messageLocal',  { message: 'DeepRed has analyzed ' + res + ' Total Black Moves' , color: 'red', timeStamp: new Date() });
        });
      }
      count += 1;
      roomInfo = {};
    });
  });

  client.on('createRoomAsBlack', (currentUserName, currentUserEmail, id, gameMode) => {
    if (queue.length !== 0) {
      room = `room ${queue.splice(0, 1)}`;
    } else {
      room = `room ${count}`;
    }
    client.join(room, () => {
      roomInfo.room = room;
      roomInfo.playerB = currentUserName;
      roomInfo.playerBemail = currentUserEmail;
      roomInfo.playerBid = client.client.id;
      roomInfo.playerBtime = 600;
      roomInfo.playerBclicked = false;
      createAndSaveNewGame(room);
      const num = parseInt(room[room.length - 1], 10);
      if (count !== num) {
        count = num;
      }
      roomInfo.count = count;
      allRooms[count] = roomInfo;
      io.emit('updateAllRooms', allRooms, allRooms[count]);
      io.to(room).emit('createRoomCompleted', roomInfo, allRooms);
      if (gameMode === 'AI') {
        roomInfo.playerW = 'AI';
        roomInfo.playerWemail = 'AI@AI';
        roomInfo.playerWid = 12345;
        roomInfo.playerWtime = 600;
        roomInfo.playerWclicked = false;
        allGames[room].moveAI((gameState) => {
          io.in(room).emit('joinRoomCompleted', roomInfo, allRooms, gameState.game);
          io.emit('updateAllRooms', allRooms, roomInfo);
          getAllMoves('W', (res) => {
            io.in(room).emit('messageLocal',  { message: 'DeepRed has analyzed ' + res + ' Total White Moves' , color: 'red', timeStamp: new Date() });
          });
          count += 1;
          roomInfo = {};
        });
      }
    });
  });

  client.on('joinRoomAsWhite', (currentUserName, currentUserEmail, clientCount) => {
    client.join(allRooms[clientCount].room, () => {
      allRooms[clientCount].playerW = currentUserName;
      allRooms[clientCount].playerWemail = currentUserEmail;
      allRooms[clientCount].playerWid = client.client.id;
      allRooms[clientCount].playerWtime = 600;
      allRooms[clientCount].playerWclicked = false;
      // createAndSaveNewGame(allRooms[clientCount].room);
      const currentGame = allGames[allRooms[clientCount].room];
      io.in(allRooms[clientCount].room).emit('joinRoomCompleted', allRooms[clientCount], allRooms, currentGame);
      io.emit('updateAllRooms', allRooms, allRooms[clientCount]);
    });
  });

  client.on('joinRoomAsBlack', (currentUserName, currentUserEmail, clientCount) => {
    client.join(allRooms[clientCount].room, () => {
      allRooms[clientCount].playerB = currentUserName;
      allRooms[clientCount].playerBemail = currentUserEmail;
      allRooms[clientCount].playerBid = client.client.id;
      allRooms[clientCount].playerBtime = 600;
      allRooms[clientCount].playerBclicked = false;
      // createAndSaveNewGame(allRooms[clientCount].room);
      const currentGame = allGames[allRooms[clientCount].room];
      io.in(allRooms[clientCount].room).emit('joinRoomCompleted', allRooms[clientCount], allRooms, currentGame);
      io.emit('updateAllRooms', allRooms, allRooms[clientCount]);
    });
  });

  client.on('disconnect', () => {
    const id = client.client.id;
    for (let i = 0; i < allRooms.length; i += 1) {
      if (allRooms[i] !== null && allRooms[i] !== undefined) {
        if (allRooms[i].playerBid === id) {
          io.in(allRooms[i].room).emit('beforeDisconnect', allRooms[i].playerB);
          console.log(`${allRooms[i].playerB} has left the room`);
          client.leave(allRooms[i].room, () => {
            allRooms[i].playerB = undefined;
            allRooms[i].playerBemail = undefined;
            allRooms[i].playerBid = undefined;
            allRooms[i].playerBtime = undefined;
            if (allRooms[i].playerW === undefined || allRooms[i].playerW === 'AI') {
              allRooms[i] = null;
              queue.push(i);
            }
            io.emit('updateAllRooms', allRooms, allRooms[i]);
          });
        }
        if (allRooms[i].playerWid === id) {
          io.in(allRooms[i].room).emit('beforeDisconnect', allRooms[i].playerW);
          console.log(`${allRooms[i].playerW} has left the room`);
          client.leave(allRooms[i].room, () => {
            allRooms[i].playerW = undefined;
            allRooms[i].playerWemail = undefined;
            allRooms[i].playerWid = undefined;
            allRooms[i].playerWtime = undefined;
            if (allRooms[i].playerB === undefined || allRooms[i].playerB === 'AI') {
              allRooms[i] = null;
              queue.push(i);
            }
            io.emit('updateAllRooms', allRooms, allRooms[i]);
          });
        }
      }
    }
  });

  // logic socket communications
  client.on('attemptMove', (origin, dest, selection, pawnPromoteType, clientRoom, gameMode) => {
    console.log('Attempted Move: ', origin, dest);
    console.log('Room Number: ', clientRoom);
    if (allGames[clientRoom]) {
      allGames[clientRoom].movePiece(
        origin,
        dest,
        ((newGameState) => {
          io.in(clientRoom).emit('attemptMoveResult', newGameState.error, newGameState.game, origin, dest, selection);
        }),
        pawnPromoteType,
        gameMode
      );
      if (gameMode === 'AI'){
        const request = encodeWithState(allGames[clientRoom].board, allGames[clientRoom].generatePieceState());
        getMovesFromDB(request, allGames[clientRoom].turn, (res) => {
          io.in(room).emit('messageLocal', { message: 'DeepRed has analyzed this move ' + res.length + ' times', color: 'red', timeStamp: new Date() })
        }, () => { io.in(room).emit('messageLocal', { message: 'DeepRed is learning.. Thank you for teaching me a new move :)', color: 'red', timeStamp: new Date() })});
      }
    }
  });

  client.on('checkLegalMoves', (origin, clientRoom, id) => {
    if (origin && allGames[clientRoom]) {
      const boolBoard = allGames[clientRoom].checkAllMovesOfOrigin(origin);
      io.to(id).emit('checkLegalMovesResults', boolBoard);
    }
  });

  client.on('startAIvAI', (id, numOfGames) => {
    if (id) {
      const result = simulateWinningGameAIvAI(numOfGames, false);
      io.to(id).emit('startAIvAIResults', result.winningGames, result.gameSummary);
    }
  });

  // control socket communications
  client.on('requestPause', (clientRoom) => {
    io.in(clientRoom).emit('requestPauseDialogBox');
  });

  client.on('rejectPauseRequest', (clientRoom) => {
    io.in(clientRoom).emit('rejectPauseRequestNotification');
  });

  client.on('handleRejectPauseRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      io.in(allRooms[clientCount].room).emit('cancelPauseNotification', allRooms[clientCount].playerB);
    } else {
      io.in(allRooms[clientCount].room).emit('cancelPauseNotification', allRooms[clientCount].playerW);
    }
  });

  client.on('agreePauseRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      allRooms[clientCount].playerBclicked = true;
    }
    if (id === allRooms[clientCount].playerWid) {
      allRooms[clientCount].playerWclicked = true;
    }
    if (allRooms[clientCount].playerBclicked === true
      && allRooms[clientCount].playerWclicked === true) {
      io.in(allRooms[clientCount].room).emit('executePauseRequest');
      allRooms[clientCount].playerBclicked = false;
      allRooms[clientCount].playerWclicked = false;
    }
  });

  client.on('requestResume', (clientRoom) => {
    io.in(clientRoom).emit('requestResumeDialogBox');
  });

  client.on('rejectResumeRequest', (clientRoom) => {
    io.in(clientRoom).emit('rejectResumeRequestNotification');
  });

  client.on('handleRejectResumeRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      io.in(allRooms[clientCount].room).emit('cancelResumeNotification', allRooms[clientCount].playerB);
    } else {
      io.in(allRooms[clientCount].room).emit('cancelResumeNotification', allRooms[clientCount].playerW);
    }
  });

  client.on('agreeResumeRequest', (clientCount, id) => {
    if (id === allRooms[clientCount].playerBid) {
      allRooms[clientCount].playerBclicked = true;
    }
    if (id === allRooms[clientCount].playerWid) {
      allRooms[clientCount].playerWclicked = true;
    }
    if (allRooms[clientCount].playerBclicked === true
      && allRooms[clientCount].playerWclicked === true) {
      io.in(allRooms[clientCount].room).emit('executeResumeRequest');
      allRooms[clientCount].playerBclicked = false;
      allRooms[clientCount].playerWclicked = false;
    }
  });

  client.on('onSurrender', (currentUser, clientRoom) => {
    io.in(clientRoom).emit('announceSurrender', currentUser);
  });

  client.on('updateTime', (clientRoom, clientCount, timeB, timeW) => {
    allRooms[clientCount].playerBtime = timeB;
    allRooms[clientCount].playerWtime = timeW;
    io.in(clientRoom).emit('sendUpdatedTime', allRooms[clientCount]);
  });

  // messaging communications
  client.on('messageLocal', (msg, count) => {
    let user = '';
    for (let key in allRooms[count]) {
      if (allRooms[count][key] === client.id) {
        if (key === 'playerWid') {
          user = allRooms[count].playerW;
        } else {
          user = allRooms[count].playerB;
        }
      }
    }
    io.in(allRooms[count].room).emit('messageLocal', msg);
  });

  client.on('messageGlobal', (msg, count) => {
    let user = '';
    for (let key in allRooms[count]) {
      if (allRooms[count][key] === client.id) {
        if (key === 'playerWid') {
          user = allRooms[count].playerW;
        } else {
          user = allRooms[count].playerB;
        }
      }
    }
    io.emit('messageGlobal', msg);
  });
};
