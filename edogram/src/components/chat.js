import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sentMessages: [],
      receivedMessages: [],
      messages: [],
      newMessage: ""
    };
  }

  componentDidMount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(
        `http://localhost:5000/posts/${user.username}/${this.props.match.params.receiver}`
      )
      .then(response => {
        this.setState({ sentMessages: response.data });
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(
        `http://localhost:5000/posts/${this.props.match.params.receiver}/${user.username}`
      )
      .then(response => {
        this.setState({ receivedMessages: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  submitHandler = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    let message = {
      body: this.state.newMessage,
      sender: user.username,
      receiver: this.props.match.params.receiver
    };
    console.log(message);
    axios
      .post("http://localhost:5000/posts", message)
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
          {this.state.sentMessages.map(message => {
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
