import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Tabs, Tab } from 'material-ui/Tabs';
import MobileTearSheet from './MobileTearSheet';
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessageLocal from './ChatMessageLocal';
import ChatMessageGlobal from './ChatMessageGlobal';

class Messages extends Component {
  render() {
    const {
      messagesLocal, messagesGlobal, sendMessageLocal,
      sendMessageGlobal, isWhite, thisUser,
    } = this.props;

    return (<Tabs>
      <Tab label="Local">
        <MobileTearSheet>
          {messagesLocal.map((msg, i) => (
            <ChatMessageLocal
              key={i + msg}
              color={msg.color}
              user={msg.user}
              message={msg.message}
              timeStamp={msg.timeStamp}
            />
          ))}
          <div id="end-of-local"></div>
        </MobileTearSheet>
        <ChatBoxLocal sendMessageLocal={sendMessageLocal} isWhite={isWhite} thisUser={thisUser} />
      </Tab>
      <Tab label="Global">
        <MobileTearSheet>
            {messagesGlobal.map((msg, i) => (
              <ChatMessageGlobal
                key={i + msg}
                isThisUser={msg.user === thisUser}
                color={msg.color}
                user={msg.user}
                message={msg.message}
                timeStamp={msg.timeStamp}
              />
            ))}
          <div id="end-of-global"></div>
        </MobileTearSheet>
        <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} isWhite={isWhite} thisUser={thisUser} />
      </Tab>
    </Tabs>)
  }

  componentDidMount() {
    document.getElementById('end-of-local').scrollIntoView();
    document.getElementById('end-of-global').scrollIntoView();
  }

  componentDidUpdate() {
    document.getElementById('end-of-local').scrollIntoView();
    document.getElementById('end-of-global').scrollIntoView();
  }
}

export default Messages;

