import React, {Component} from 'react';

class ChatBox extends Component {
  constructor (props) {
		super(props);
    this.state = {
     message: ''
    }
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    }

	submit (info) {
    info.preventDefault();
    this.props.sendMessage(this.state.message)
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
             <h6>{msg}</h6>
         )}
        <form>
        <input type='text' value={this.state.message} onChange={this.handleChange}/><button onClick={(info) => this.submit(info)}>Send</button>
        </form>
      </div>
    )
  }
}

export default ChatBox;