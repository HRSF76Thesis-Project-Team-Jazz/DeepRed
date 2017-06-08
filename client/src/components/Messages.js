import React , { Component } from 'react';

class Messages extends Component {
    constructor(props) {
        super(props)
        this.scrollBottom = this.scrollBottom.bind(this);
    }

    scrollBottom(){
        this.context.scrollArea.scrollBottom();
        console.log('THIS---------', this)
    }

    render() {
        return (
            <div onClick={() => this.scrollBottom()}>
              <ul className="message-list">
                {this.props.messages.map((msg, i) =>
                <div className="message" key={i + msg}>{msg}</div>,
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
