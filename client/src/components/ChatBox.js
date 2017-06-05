import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { red50, red900 } from 'material-ui/styles/colors';

import './css/ChatBox.css';

class ChatBox extends Component {
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
    this.props.sendMessage(this.state.message);
    this.state.message = '';
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
        <ul className="message-list">
          {this.props.messages.map((msg, i) =>
            <div className="message" key={i + msg}>{msg}</div>,
          )}
        </ul>
        <form>
          <TextField
            className="text-field"
            hintText="Message Opponent"
            underlineStyle={{ borderColor: red900 }}
            underlineFocusStyle={{ borderColor: red900 }}
            value={this.state.message}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          {/* <RaisedButton
            label="Submit"
            style={{ margin: 12 }}
            onClick={info => this.submit(info)}
            backgroundColor="#600003"
            labelColor={red50}
          /> */}
        </form>
      </div>
    );
  }
}

export default ChatBox;
