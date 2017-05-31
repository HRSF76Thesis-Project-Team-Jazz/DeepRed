import React from 'react';

import './css/CapturedPieces.css';

const CapturedPieces = ({ color, capturedPieces, player }) => (
  <div className="captured-pieces">
    <h5>Player: {player}</h5>
    <h5>Captured Pieces: {color}</h5>
    <div className="pieces-container">
      {capturedPieces.map(piece => (
        <img
          className="captured-img"
          src={`/assets/${piece}.png`}
          alt="captured pieces"
        />
      ),
      )}
    </div>
  </div>
);

export default CapturedPieces;
