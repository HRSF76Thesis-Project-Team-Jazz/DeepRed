import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import { pauseTimerB, pauseTimerW } from '../store/actions';
import './css/Clock.css';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.readyForGame = this.readyForGame.bind(this);
  }

  readyForGame(e) {
    const {dispatch, pausedW, pausedB, gameTurn, clockW, clockB} = this.props;
    console.log('hello from ready for game: ', this.props.color);
    if (this.props.color === 'Black') {
      console.log('black triggered');
      dispatch(pauseTimerB(pausedB));
    } else if (this.props.color === 'White') {
      console.log('white triggered');
      dispatch(pauseTimerB(pausedW));
    }
  }

  render() {
    const { sendPauseRequest } = this.props;
    return (
      <div>
        <ReactCountdownClock
          seconds={600}
          color="#000"
          alpha={0.8}
          size={100}
          paused={false}
          onClick={sendPauseRequest}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, userState } = state;
  const {
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
    room,
    pausedB,
    pausedW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  };
}

export default connect(mapStateToProps)(Clock);
