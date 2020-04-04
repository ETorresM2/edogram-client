import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./style/dashboard.css"


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
    .get(`https://edgram.herokuapp.com/friends/${user.id}`)
    .then(response => this.setState({ friends: response.data }))
    .catch(error => console.log(error));
    console.log(localStorage.getItem("user"))
  };

  componentDidUpdate = () => {
    // const user = JSON.parse(localStorage.getItem("user"))
    // axios
    // .get(`https://edgram.herokuapp.com/friends/${user.id}`)
    // .then(response => this.setState({ friends: response.data }))
    // .catch(error => console.log(error));
  }

  changeHandler = e => {
    e.preventDefault()
    this.setState({friend:e.target.value})
  }

  submitHandler = e => {
    const user = JSON.parse(localStorage.getItem("user"))

    e.preventDefault()
    axios.post("https://edgram.herokuapp.com/friends", {"initiator":user.id, "friendName": this.state.friend})
    .then(response => {
      console.log(response)
    })
    .catch(error => console.log(error))
    .then(()=> {
      axios
      .get(`https://edgram.herokuapp.com/friends/${user.id}`)
      .then(response => this.setState({ friends: response.data }))
      .catch(error => console.log(error))
    })

  }

  render() {
    const user = JSON.parse(localStorage.getItem("user"))
    return (
      <div className="sidebar">
        <h2>Logged in as {user.username} </h2>
        <div>
          <h3>Contacts:</h3>
          <div>
            <form onSubmit={this.submitHandler}>
              <input className="addFriendInput" type="text" name="friend" placeholder="username" value={this.state.friend} onChange={this.changeHandler} />
              <button className="addFriendButton" type="submit">Add Contact</button>
            </form>
          </div>
          <div className="friendsList">
          {this.state.friends.map(friend => {
            return (
              <Link to = {`/dashboard/chat/${friend.friendName}`}>
                <div className = "friendLink">
                  <h4>{friend.friendName}</h4>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
