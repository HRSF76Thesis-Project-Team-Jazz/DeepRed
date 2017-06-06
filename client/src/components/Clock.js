import React, { Component } from 'react';
import { connect } from 'react-redux';

class Clock extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { milisecB, milisecW, minB, minW, secB, secW } = this.props;

    return (
      <div className="clock-class" >
        <span>{this.props.color === 'Black' ? (`0${minB}`).slice(-2) : (`0${minW}`).slice(-2)}
          : {this.props.color === 'Black' ? (`0${secB}`).slice(-2) : (`0${secW}`).slice(-2)}
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState } = state;
  const {
    milisecB,
    milisecW,
    secB,
    secW,
    minB,
    minW,
    timeB,
    timeW,
  } = gameState;
  return {
    milisecB,
    milisecW,
    secB,
    secW,
    minB,
    minW,
    timeB,
    timeW,
  };
}

export default connect(mapStateToProps)(Clock);