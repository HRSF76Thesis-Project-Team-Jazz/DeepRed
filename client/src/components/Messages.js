import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import MobileTearSheet from './MobileTearSheet';
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';

const Messages = ({ messagesLocal, messagesGlobal, sendMessageLocal, sendMessageGlobal }) => (
  <Tabs>
    <Tab label="Local">
      <MobileTearSheet>
        <ul className="message-list" >
          {messagesLocal.map((msg, i) =>
            <div className="message" key={i + msg} >{msg}</div>
          )}
        </ul>
      </MobileTearSheet>
      <ChatBoxLocal sendMessageLocal={sendMessageLocal} />
    </Tab>
    <Tab label="Global">
      <MobileTearSheet>
        <ul className="message-list" >
          {messagesGlobal.map((msg, i) =>
            <div className="message" key={i + msg} >{msg}</div>
          )}
        </ul>
      </MobileTearSheet>
      <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} />
    </Tab>
  </Tabs>
);

export default Messages;

