import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { red50, red900 } from 'material-ui/styles/colors';
// import Messages from './Messages'

import './css/ChatBox.css';

class ChatBoxGlobal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  submit(info) {
    info.preventDefault();
    this.props.sendMessageGlobal({
      user: this.props.thisUser,
      color: (this.props.isWhite) ? 'W' : 'B',
      message: this.state.message,
      timeStamp: new Date(),
    });
    this.setState({ message: '' });
  }

  handleChange(info) {
    this.setState({
      message: info.target.value,
    });
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.submit(event);
    }
  }

  render() {
    return (
      <div>
        <TextField
          className="textfield"
          style={{ width: '18vw' }}
          hintText="Message Opponent"
          underlineStyle={{ borderColor: red900 }}
          underlineFocusStyle={{ borderColor: red900 }}
          value={this.state.message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}


export default ChatBoxGlobal;
