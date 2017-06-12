import React from 'react';
import './css/ChatMessage.css';

const ChatMessage = ({ user, color, message, timeStamp }) => (
  <div>
    <div className="chat-timeStamp">{timeStamp}</div>
    <div className={(color === 'W') ? 'chat-message-container white-chat' : (color === 'B') ? 'chat-message-container black-chat' : (color === 'red') ? 'chat-message-container red-chat' : 'chat-message-container other-chat'}>
      <span className="chat-message">{message}</span>
    </div>
  </div>
);

export default ChatMessage;
