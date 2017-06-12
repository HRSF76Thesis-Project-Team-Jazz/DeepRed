import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import MobileTearSheet from './MobileTearSheet';
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessage from './ChatMessage';

const Messages = ({
  messagesLocal, messagesGlobal, sendMessageLocal,
  sendMessageGlobal, isWhite, thisUser }) => (
    <Tabs>
      <Tab label="Local">
        <MobileTearSheet>
          <ul className="message-list" >
            {messagesLocal.map((msg, i) =>
              <ChatMessage key={i + msg} color={msg.color} user={msg.user} message={msg.message} timeStamp={msg.timeStamp} />
            )}
          </ul>
        </MobileTearSheet>
        <ChatBoxLocal sendMessageLocal={sendMessageLocal} isWhite={isWhite} thisUser={thisUser} />
      </Tab>
      <Tab label="Global">
        <MobileTearSheet>
          <ul className="message-list" >
            {messagesGlobal.map((msg, i) =>
              <div className="message" key={i + msg} ><span>{msg.user}</span>{msg.message}</div>
            )}
          </ul>
        </MobileTearSheet>
        <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} isWhite={isWhite} thisUser={thisUser} />
      </Tab>
    </Tabs>
  );

export default Messages;

