import React from 'react';
import './css/CapturedPieces.css';

const CapturedPieces = ({ capturedPieces }) => (
  <div className="captured-pieces" >
    <div className="pieces-container">
      {capturedPieces.map((piece, index) => (
        <img
          key={index}
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
