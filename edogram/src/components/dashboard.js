import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";


class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      friends: [],
      friend: "",
      searchMessage:""
    };
  }

  componentDidMount = () => {
    this.setState([this.state.user, this.props.user]);
    axios
    .get(`http://localhost:5000/friends/${this.props.user.id}`)
    .then(response => this.setState({ friends: response.data }))
    .catch(error => console.log(error));
  };

  componentDidUpdate = () => {
    axios
    .get(`http://localhost:5000/friends/${this.props.user.id}`)
    .then(response => this.setState({ friends: response.data }))
    .catch(error => console.log(error));
  }

  changeHandler = e => {
    e.preventDefault()
    this.setState({friend:e.target.value})
  }

  submitHandler = e => {
    e.preventDefault()
    axios.post("http://localhost:5000/friends", {"initiator":this.props.user.id, "friendName": this.state.friend})
    .then(response => {
      console.log(response)
    })
    .catch(error => console.log)
    this.setState({friend:""})

  }

  render() {
    return (
      <div>
        <h1>Welcome to Dashboard</h1>

        <p>Name: {this.props.user.username} </p>
        <div>
          <h3>Contacts:</h3>
          <div>
            <form onSubmit={this.submitHandler}>
              <input type="text" name="friend" placeholder="username" value={this.state.friend} onChange={this.changeHandler} />
              <button type="submit">Add Contact</button>
            </form>
          </div>
          {this.state.friends.map(friend => {
            return (
              <Link to = {`/chat/${friend.friendName}`}>
                <div>
                  <h4>{friend.friendName}</h4>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Dashboard;
