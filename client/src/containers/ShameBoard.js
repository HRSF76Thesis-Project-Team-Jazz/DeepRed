import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import { } from '../store/actions';

// Components
import './css/App.css';

class ShameBoard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    // const {  } = this.props;
    return (
      <div>
        <p>from shame board</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { } = state;

  return {

  };
}

export default connect(mapStateToProps)(ShameBoard);
