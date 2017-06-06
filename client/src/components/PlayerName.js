import React from 'react';
import './css/PlayerName.css';

const PlayerName = ({ color, player, position }) => (
  <div className={(position === 'top') ? 'player-top' : 'player-bot'}>
    {color}: {player}
  </div>
);

export default PlayerName;
