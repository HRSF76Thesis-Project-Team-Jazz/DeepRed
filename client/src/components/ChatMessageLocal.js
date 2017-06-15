import React from 'react';
import './css/ChatMessage.css';

const ChatMessageLocal = ({ user, color, message, timeStamp }) => (
  <div>
    <div className="chat-timeStamp">{timeStamp}</div>
    <div className={(color === 'W') ? 'chat-message-container white-chat' : (color === 'B') ? 'chat-message-container black-chat' : (color === 'red') ? 'chat-message-container red-chat' : 'chat-message-container other-chat'}>
      {(color === 'red') ? (
        <table>
          <tbody>
            <tr>
              <td><img className="red-image" src={'/assets/redChat.png'} alt={''} /></td>
              <td><span className="chat-message">{message}</span></td>
            </tr>
          </tbody>
        </table>
      ) : (<span className="chat-message">{message}</span>)}
    </div>
  </div>
);

export default ChatMessageLocal;
