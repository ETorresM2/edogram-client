import React from "react";

import axios from "axios";
import "./style/login.css"

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      creds: {
        username: "",
        password: ""
      },
      user: {},
      message: ""
    };
  }

  sendUser = () => {
    this.props.callback(this.state.user);
  };
  getUser = response => {
    localStorage.setItem("user", JSON.stringify(response.data));
    console.log(localStorage.getItem("user"));
    this.setState({ user: response.data });
    if (this.state.user) {
      this.sendUser();
      this.props.history.push("/dashboard");
    }
  };
  loginHandler = event => {
    event.preventDefault();
    axios
      .post("https://edgram.herokuapp.com/login", this.state.creds)
      .then(response => this.getUser(response))
      .catch(error => console.log(error));
    this.setState({
      creds: {
        ...this.state.creds,
        username: "",
        password: ""
      }
    });
  };

  changeHandler = event => {
    this.setState({
      creds: {
        ...this.state.creds,
        [event.target.name]: event.target.value
      }
    });
  };

  registerHandler = event => {
    event.preventDefault();
    axios
      .post("https://edgram.herokuapp.com/users", this.state.creds)
      .then(this.setState({ message: "Registration Successful" }))
      .catch(error =>
        console
          .log(error)
          .then(this.setState({ message: "Registration Failed" }))
      );

    this.setState({
      creds: {
        ...this.state.creds,
        username: "",
        password: ""
      }
    });
  };

  render() {
    return (
      <div className = "loginWrapper">
        <h3>Login</h3>
        <p>Please use your username and password to login, or to create an account click register after entering your desired credentials.</p>
        <form onSubmit={this.loginHandler}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.creds.username}
            onChange={this.changeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.creds.password}
            onChange={this.changeHandler}
          />

          <button className="loginButton" type="submit">Login</button>
        </form>
        <button className="registerButton" onClick={this.registerHandler}>Register</button>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Login;
