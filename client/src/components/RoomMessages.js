import React, { Component } from 'react';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessageGlobal from './ChatMessageGlobal';
import RoomTearSheet from './RoomTearSheet';

class RoomMessages extends Component {

    componentDidMount() {
        document.getElementById('end-of-room-global').scrollIntoView();
    }

    componentDidUpdate() {
        document.getElementById('end-of-room-global').scrollIntoView();
    }


    render() {
        const {
            messagesGlobal, sendMessageGlobal, isWhite, thisUser, 
        } = this.props;

        return (
            <div>
            <RoomTearSheet >
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
            <div id="end-of-room-global" />
            </RoomTearSheet>
          <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} isWhite={isWhite} thisUser={thisUser} />
          </div>
        );
    }
}

export default RoomMessages