import React, {Component} from 'react';

class ChatBox extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: ''
        }
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.socket = this.socket.bind(this)
    }

    submit (info) {
            // let socket = io();
            info.preventDefault();
            // console.log('click', this.state.message)
            this.props.sendMessage(this.state.message)
            // socket.emit('message', this.state.message)
            // socket.on('message', (msg) => {
            //     var curr = this.state.messages.push(msg)
            //     this.setState({
            //         messages: curr
            //     })
            // })
            // console.log('clicked').then(() => console.log('2'))
            // erase current input
     }

    handleChange (info) {
            this.setState({
                message: info.target.value
            })
     }

// 

    render () {
        return (
        <div>
            <h4>ChatBox</h4>
            <ul id='messages'></ul>
            {this.props.messages.map((info) => 
                <h5>{info}</h5>
            )}
            <form>
            <input type='text' value={this.state.message} onChange={this.handleChange}/><button onClick={(info) => this.submit(info)} >Send</button>
            </form>
        </div>
        )
    }
}




export default ChatBox;