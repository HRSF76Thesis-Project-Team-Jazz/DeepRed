import React from 'react';

import './css/CapturedPieces.css';

const CapturedPieces = ({ color, capturedPieces }) => {
  return (
    <div className="captured-pieces">
      <h5>Captured Pieces: {color}</h5>
      {JSON.stringify(capturedPieces)}
    </div>
  );
};

export default CapturedPieces;
