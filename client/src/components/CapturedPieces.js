import React, { Component } from 'react';

import './css/CapturedPieces.css';

class CapturedPieces extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="captured-pieces">
        <h5>Captured Pieces: {this.props.color}</h5>
      </div>
    );
  }

}

export default CapturedPieces;
