const errorBot = (key) => {
  let errorStore = {
    'Cannot leave yourself in check': ['Cannot leave yourself in check.'], 
    'Attempted destination is invalid.': ['Attempted destination is invalid.'],
    'Origin and destination cannot be the same.': ['Origin and destination cannot be the same'],
    'Not your turn.': ['Back up there...', 'Reign in those horses.', 'Don\'t worry, your turn is coming'],
    'Move is not allowed.': ['Move is not allowed'],
    'Cannot capture your own piece.': ['Cannot capture your own piece.'],
    'Origin is invalid.': ['Origin is invalid.'],
  }

  console.log('key: ', key);
  if (errorStore.hasOwnProperty(key)) {
      if (errorStore[key].length === 1) {
        return errorStore[key][0];
      } else if (errorStore[key].length >= 2) {
          return errorStore[key][Math.floor(Math.random() * errorStore[key].length)];
      }
  }
  return 'system error';
}

module.exports = errorBot;