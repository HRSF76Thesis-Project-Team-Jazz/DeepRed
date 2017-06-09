import React , { Component } from 'react';
import Infinite from 'react-infinite';
import ScrollArea from 'react-scrollbar';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.componentWillUpdate = this.componentWillUpdate.bind(this)
}

// componentWillUpdate(){
//     this.context.scrollArea.scrollBottom();
// }

    render() {
        return (
            <div onClick={() => this.refresh()}>
              <ul className="message-list" >
                {this.props.messages.map((msg, i) =>
                <div className="message" key={i + msg} >{msg}</div>,
                )}
              </ul>
            </div>
        )
    }
}

Messages.contextTypes = {
    scrollArea: React.PropTypes.object
}

export default Messages;
