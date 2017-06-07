import React from 'react';
import './css/PlayerName.css';

const PlayerName = ({ color, player, position }) => (
  <div>
    {player}
  </div>
);

export default PlayerName;
// className={(position === 'top') ? 'player-top' : 'player-bot'}
