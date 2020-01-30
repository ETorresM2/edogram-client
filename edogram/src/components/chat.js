import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const user = JSON.parse(localStorage.getItem("user"));

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores messages user has sent
      sentMessages: [],
      // stores messages user has recieved
      receivedMessages: [],
      // this will be used to store a concatenated array of sent and received messages to be sorted later by id
      messages: [],
      // this is used to store the body of a new message created in the form
      newMessage: ""
    };
  }

  componentDidMount = () => {
    // get messages sent by the logged in user and sets them to state
    axios
      .get(
        `http://localhost:5000/posts/${user.username}/${this.props.match.params.receiver}`
      )
      .then(response => {
        this.setState({ sentMessages: response.data });
      })
      // below function gets received messages and sets them to state
      .then(response => {
        this.getReceivedMessages().catch(err => {
          console.log(err);
        });
      });
  };

  getReceivedMessages = () => {
    return axios
      .get(
        `http://localhost:5000/posts/${this.props.match.params.receiver}/${user.username}`
      )
      .then(response => {
        this.setState({ receivedMessages: response.data });
      })
      .then(response => {
        this.combineMessages();
      })
      .catch(err => {
        console.log(err);
      });
  };

  combineMessages = () => {
    console.log(this.state);
    let receivedMessages = this.state.receivedMessages;
    let sentMessages = this.state.sentMessages;
    let messages = sentMessages.concat(receivedMessages);
    messages.sort(function(a, b) {
      return a.id - b.id;
    });
    this.setState({ messages: messages });
  };

  submitHandler = e => {
    e.preventDefault();

    let message = {
      body: this.state.newMessage,
      sender: user.username,
      receiver: this.props.match.params.receiver
    };
    axios
      .post("http://localhost:5000/posts", message)
      // Instead, run a get request, and then combine
      .then(response => {
        this.setState(prevState => ({
          sentMessages: [...prevState.sentMessages, message]
        }));
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ newMessage: "" });
  };

  changeHandler = event => {
    this.setState({
      newMessage: event.target.value
    });
  };

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <div>
          <h3>Messages:</h3>
          {this.state.messages.map(message => {
            return <div>{message.body}</div>;
          })}
          <form onSubmit={this.submitHandler}>
            <input
              type="text"
              placeholder="type message"
              value={this.state.newMessage}
              onChange={this.changeHandler}
            />
            <button>Enter</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Chat;
