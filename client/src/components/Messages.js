import React , { Component } from 'react';
import MobileTearSheet from './MobileTearSheet';
import { Tabs, Tab } from 'material-ui/Tabs';
<<<<<<< HEAD
import ChatBox from './ChatBox';
import ChatBox2 from './ChatBox2';
=======
import ChatBoxLocal from './ChatBoxLocal';
import ChatBoxGlobal from './ChatBoxGlobal';

>>>>>>> added global chat
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
<<<<<<< HEAD


=======
    
>>>>>>> added global chat
export default Messages;
