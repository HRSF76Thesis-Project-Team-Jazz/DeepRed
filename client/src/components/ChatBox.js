import React, {Component} from 'react';

class ChatBox extends Component {
  constructor (props) {
		super(props);
    this.state = {
     message: '',
		 user: 'jay'
    }
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
        // this.socket = this.socket.bind(this)
    }

	submit (info) {
    info.preventDefault();
		// reassign state.user as current user
		console.log('========>',this.userState)
    this.props.sendMessage(this.state.user + ': ' + this.state.message)
		this.state.message = '';
  }

  handleChange (info) {
     this.setState({
        message: info.target.value
     })
  }

 	render () {
    return (
       <div>
        <h4>ChatBox</h4>
        <ul id='messages'></ul>
         {this.props.messages.map((msg) => 
             <h5>{msg}</h5>
         )}
        <form>
        <input type='text' value={this.state.message} onChange={this.handleChange}/><button onClick={(info) => this.submit(info)}>Send</button>
        </form>
      </div>
    )
  }
}

export default ChatBox;