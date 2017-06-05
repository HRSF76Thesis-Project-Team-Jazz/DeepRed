import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import { pauseTimer } from '../store/actions';

class Clock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sendPauseRequest, pausedB, pausedW, timeB, timeW, gameTurn } = this.props;

    return (
      <div>
        <ReactCountdownClock
          seconds={(this.props.color === 'Black') ? timeB : timeW}
          color="#000"
          alpha={0.8}
          size={85}
          paused={(this.props.color === 'Black') ? pausedW : pausedB}
          onClick={sendPauseRequest}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, userState } = state;
  const {
    timeB,
    timeW,
    pausedB,
    pausedW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  } = gameState;
  const {
    room,
  } = userState;
  return {
    timeB,
    timeW,
    room,
    pausedB,
    pausedW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  };
}

export default connect(mapStateToProps)(Clock);
