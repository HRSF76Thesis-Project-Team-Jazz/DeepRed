const gamePlay = require('./gamePlay');

const { simulateGames, displayFullBoard } = gamePlay;

simulateGames(1000, false, displayFullBoard);
