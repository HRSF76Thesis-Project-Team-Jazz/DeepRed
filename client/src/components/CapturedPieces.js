import React from 'react';
import Clock from '../components/Clock';
import './css/CapturedPieces.css';

const CapturedPieces = ({ color, capturedPieces, player, sendPauseRequest }) => (
  <div className="captured-pieces" >
    {/* <h5><span className="display-color-text">{color}</span>: <span className="display-color-text">{player}</span></h5> */}
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
    {/* <div className="countdown-clock">
      <Clock color={color} sendPauseRequest={sendPauseRequest} />
    </div> */}
  </div>
);

export default CapturedPieces;
