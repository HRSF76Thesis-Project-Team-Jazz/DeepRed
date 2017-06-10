import React , { Component } from 'react';
import MobileTearSheet from './MobileTearSheet';
import { Tabs, Tab } from 'material-ui/Tabs';
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';

class Messages extends Component {
  constructor(props) {
    super(props);
  }   

  render() {
    return (
      <Tabs>
        <Tab label='Local'>
          <MobileTearSheet>
            <ul className="message-list" >
              {this.props.messagesLocal.map((msg, i) =>
                <div className="message" key={i + msg} >{msg}</div>
              )}
            </ul>
            </MobileTearSheet>
            <ChatBoxLocal sendMessageLocal={this.props.sendMessageLocal}/>
        </Tab>
        <Tab label='Global'>
          <MobileTearSheet>
            <ul className="message-list" >
              {this.props.messagesGlobal.map((msg, i) =>
                <div className="message" key={i + msg} >{msg}</div>
              )}
            </ul>
          </MobileTearSheet>
          <ChatBoxGlobal sendMessageGlobal={this.props.sendMessageGlobal}/>
        </Tab>
      </Tabs>
    )
  }
}
    
export default Messages;