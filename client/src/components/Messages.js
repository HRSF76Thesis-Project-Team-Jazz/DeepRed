import React , { Component } from 'react';
import MobileTearSheet from './MobileTearSheet';
import { Tabs, Tab } from 'material-ui/Tabs';
import ChatBox from './ChatBox';
import ChatBox2 from './ChatBox2';

class Messages extends Component {
    constructor(props) {
        super(props);
    }   

    render() {
        return (
            <Tabs>
                <Tab label='A'>
                <MobileTearSheet>
                <ul className="message-list" >
                    {this.props.messages.map((msg, i) =>
                    <div className="message" key={i + msg} >{msg}</div>
                    )}
                </ul>
                </MobileTearSheet>
                 <ChatBox sendMessage={this.props.sendMessage}/>
                </Tab>
                <Tab label='B'>
                    <p>Feed of Universal Chatroom</p>
                <ChatBox2 sendMessage={this.props.sendMessage}/>
                </Tab>
            
            </Tabs>

export default Messages;
