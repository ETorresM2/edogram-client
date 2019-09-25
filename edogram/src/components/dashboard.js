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
    const user = JSON.parse(localStorage.getItem("user"))
    this.setState([this.state.user, localStorage.getItem("user")]);
    axios
    .get(`http://localhost:5000/friends/${user.id}`)
    .then(response => this.setState({ friends: response.data }))
    .catch(error => console.log(error));
    console.log(localStorage.getItem("user"))
  };

  componentDidUpdate = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    axios
    .get(`http://localhost:5000/friends/${user.id}`)
    .then(response => this.setState({ friends: response.data }))
    .catch(error => console.log(error));
  }

  changeHandler = e => {
    e.preventDefault()
    this.setState({friend:e.target.value})
  }

  submitHandler = e => {
    const user = JSON.parse(localStorage.getItem("user"))

    e.preventDefault()
    axios.post("http://localhost:5000/friends", {"initiator":user.id, "friendName": this.state.friend})
    .then(response => {
      console.log(response)
    })
    .catch(error => console.log(error))
    this.setState({friend:""})

  }

  render() {
    const user = JSON.parse(localStorage.getItem("user"))
    return (
      <div>
        <h1>Welcome to Dashboard</h1>

        <p>Name: {user.username} </p>
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
