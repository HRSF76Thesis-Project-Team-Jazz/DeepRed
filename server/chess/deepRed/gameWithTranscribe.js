const gamePlay = require('./gamePlay');

const { simulateGames, displayTranscribe } = gamePlay;

simulateGames(1000, false, displayTranscribe);
