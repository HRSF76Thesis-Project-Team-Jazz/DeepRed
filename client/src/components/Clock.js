import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import './css/Clock.css';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleString(),
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: new Date().toLocaleString(),
      });
    }, 1000);
  }

  render() {
    return (
      <div className="">
        <ReactCountdownClock seconds={300}
                     color="#000"
                     alpha={0.5}
                     size={100}
                      />
        <h5>Clock</h5>
        <p>{ this.state.time }</p>
      </div>
    );
  }
}

export default Clock;
// onComplete={myCallback}