import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import MobileTearSheet from './MobileTearSheet';
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessageLocal from './ChatMessageLocal';
import ChatMessageGlobal from './ChatMessageGlobal';

class Messages extends Component {

  componentDidMount() {
    document.getElementById('end-of-local').scrollIntoView();
    document.getElementById('end-of-global').scrollIntoView();
  }

  componentDidUpdate() {
    document.getElementById('end-of-local').scrollIntoView();
    document.getElementById('end-of-global').scrollIntoView();
  }

  render() {
    const {
      messagesLocal, messagesGlobal, sendMessageLocal,
      sendMessageGlobal, isWhite, thisUser, gameMode,
    } = this.props;

    return (
      <Tabs
        className="tabs"
        inkBarStyle={{ background: '#00BCD4', zIndex: 1000 }}
      >
        <Tab
          className="tab"
          style={{ backgroundColor: '#C62828' }}
          label={gameMode === 'default' ? 'LOCAL' : 'DEEPRED'}
        >
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
            <div id="end-of-local" />
          </MobileTearSheet>
          <ChatBoxLocal sendMessageLocal={sendMessageLocal} isWhite={isWhite} thisUser={thisUser} />
        </Tab>
        <Tab
          className="tab"
          style={{ backgroundColor: '#C62828' }}
          label="Global"
        >
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
            <div id="end-of-global" />
          </MobileTearSheet>
          <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} isWhite={isWhite} thisUser={thisUser} />
        </Tab>
      </Tabs>);
>>>>>>> styling material-ui, CSS
  }
}

export default Messages;
