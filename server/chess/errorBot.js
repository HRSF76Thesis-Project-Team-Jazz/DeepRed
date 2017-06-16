const errorBot = (key) => {
  const errorStore = {
    'Cannot leave yourself in check.': [
      'Cannot leave yourself in check.',
      'Watch out! you are still in check',
    ],
    'Attempted destination is invalid.': [
      'Attempted destination is invalid.',
      'Invalid destination!',
    ],
    'Origin and destination cannot be the same.': [
      'Origin and destination cannot be the same',
      'Move somewhere else :)',
      'You can\'t stay at the same lcoation',
    ],
    'Not your turn.': [
      'Back up there...',
      'Reign in those horses.',
      'Don\'t worry, your turn is coming',
    ],
    'Move is not allowed.': [
      'Move is not allowed',
      'Attempted destination is invalid.',
      'Invalid destination!',
    ],
    'Cannot capture your own piece.': [
      'Cannot capture your own piece.',
      'No killing among same kind LOL',
    ],
    'Origin is invalid.': [
      'Origin is invalid.',
      'Please choose a different origin~',
    ],
    'game has paused!': [
      'game has paused!',
    ],
    'game has resumed!': [
      'game has resumed!',
    ],
    'game is already in pause :)': [
      'game is already in pause :)',
    ],
    'current game is still running': [
      'current game is still running',
    ],
  };

  // console.log('key: ', key);
  if (errorStore.hasOwnProperty(key)) {
    if (errorStore[key].length === 1) {
      return errorStore[key][0];
    } else if (errorStore[key].length >= 2) {
      return errorStore[key][Math.floor(Math.random() * errorStore[key].length)];
    }
  }
  return 'system error';
};

module.exports = errorBot;
