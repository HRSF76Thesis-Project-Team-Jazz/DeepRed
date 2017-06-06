import React, { Component } from 'react';
import { connect } from 'react-redux';

class Clock extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   let { dispatch, timeB } = this.props;
  //   setInterval(() => {
  //     timeB -= 1;
  //     dispatch(decreamentTimerB(timeB));
  //   }, 1000);
  // }

  render() {
    const { sendPauseRequest, timeB, timeW } = this.props;

    return (
      <div className="clock-class" >
        <span>time Left: {this.props.color === 'Black' ? timeB : timeW}</span>
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
// {/*<ReactCountdownClock
//   seconds={(this.props.color === 'Black') ? timeB : timeW}
//   color="#000"
//   alpha={0.8}
//   size={85}
//   paused={(this.props.color === 'Black') ? pausedW : pausedB}
//   onClick={sendPauseRequest}
// />*/}
