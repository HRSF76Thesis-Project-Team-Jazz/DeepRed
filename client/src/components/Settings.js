import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Link to="/">Home</Link>
      </div>
    );
  }

}

export default Settings;
