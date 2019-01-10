import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.socket = new WebSocket('wss://gohbcy9avk.execute-api.us-west-2.amazonaws.com/dev');
    this.state = {
      messageToSend: "",
      receivedMessages: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  
  componentDidMount() {
    this.socket.onopen = (event) => {
        console.log("successfully connected to websocket server");
    }

    this.socket.onmessage = (event) => {
        console.log(event);
        this.setState({receivedMessages: [...this.state.receivedMessages, event.data]});
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleChange(event) {
    this.setState({messageToSend: event.target.value});
  }

  sendMessage(event) {
      event.preventDefault();
      let jsonData = JSON.stringify({       
           "action":"sendmessage", 
           "clientID": 1,
           "data": this.state.messageToSend
      });
      this.socket.send(jsonData);
      this.setState({messageToSend: ""});
  }

  renderReceivedMessages() {
    return this.state.receivedMessages.map((message, index) => {
      return <li key={index}>{message}</li> 
    });
  }

  render() {
    return (
      <div>
        Message: <strong>{this.state.message}</strong>
        <div>
            <form onSubmit={this.sendMessage}>
                <label>Write Message</label>
                <input type="text" value={this.state.messageToSend} onChange={this.handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
        <div>
          <h3>Your Messages</h3>
          <ul>
            {this.renderReceivedMessages()}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
