const gamePlay = require('./gamePlay');
const gameConfig = require('./gameConfig');

const { simulateGames, displayTranscribe } = gamePlay;
const { NUMBER_OF_GAMES } = gameConfig;

simulateGames(NUMBER_OF_GAMES, false, displayTranscribe);
