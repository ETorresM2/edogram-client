import React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import "./style/chat.css"
axios.defaults.withCredentials = true;
let user = JSON.parse(localStorage.getItem("user"));

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendName: "",
      unread: false,
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
    // sets socket data
    const socket = socketIOClient("https://edgram.herokuapp.com/");
    // recieves the update flag from server. When the server emits the flag, it gets set to state,
    // and that triggers the conditional in componentDidUpdate
    socket.on("updateFlag", data => this.setState({ unread: data }))
    // gets user data from local storage
    user = JSON.parse(localStorage.getItem("user"));
    // get messages sent by the logged in user and sets them to state
    axios
      .get(
        `https://edgram.herokuapp.com/posts/${user.username}/${this.props.match.params.receiver}`
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
      this.setState({friendName: this.props.match.params.receiver})
  };

  // if the update flag is set to true, then this function executes getReceivedMessages, and then sets the flag back to  to false
  componentDidUpdate = () => {
    if (this.state.friendName !== this.props.match.params.receiver) {
      console.log("changed")
      axios
      .get(
        `https://edgram.herokuapp.com/posts/${user.username}/${this.props.match.params.receiver}`
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
      this.setState({friendName: this.props.match.params.receiver})
    }
    if (this.state.unread===true) {
      axios
      .get(
        `https://edgram.herokuapp.com/posts/${user.username}/${this.props.match.params.receiver}`
      )
      .then(response => {
        this.setState({ sentMessages: response.data });
      })
      // below function gets received messages and sets them to state
      .then(response => {
        this.getReceivedMessages().catch(err => {
          console.log(err);
        });
      })
      .then(this.setState({unread: false}));
    }
  }

  // gets the messages from API, sets it to state, then sorts it and sets it to state again
  getReceivedMessages = () => {
    return axios
      .get(
        `https://edgram.herokuapp.com/posts/${this.props.match.params.receiver}/${user.username}`
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

  // combines sent and received into one array, then sorts them by id
  combineMessages = () => {
    console.log("sorting");
    let receivedMessages = this.state.receivedMessages;
    let sentMessages = this.state.sentMessages;
    let messages = sentMessages.concat(receivedMessages);
    messages.sort(function(a, b) {
      return a.id - b.id;
    });
    console.log("sorted, and setting")
    console.log("messages: ", messages)
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
      .post("https://edgram.herokuapp.com/posts", message)
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
      <div className= "chatWrapper">
        <div className="messagesHeader">
    <h1>{this.props.match.params.receiver}</h1>
        </div>
        <div>
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
