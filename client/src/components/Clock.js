import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import { pauseTimer } from '../store/actions';
import './css/Clock.css';

class Clock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sendPauseRequest, paused, timeB, timeW } = this.props;
    let time = 0;

    if (this.props.color === 'Black') {
      time = timeB;
    } 
    if (this.props.color === 'White') {
      time = timeW;
    }
    console.log('timeB: ', timeB);
    console.log('timeW: ', timeW);
    console.log('color: ', this.props.color);
    return (
      <div>
        <ReactCountdownClock
          seconds={time}
          color="#000"
          alpha={0.8}
          size={100}
          paused={paused}
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
    paused,
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
    paused,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  };
}

export default connect(mapStateToProps)(Clock);
