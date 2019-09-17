import React from "react";
import axios from "axios";

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

  submitHandler = event => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/login", this.state.creds)
      .then(response => this.setState({user: response.data}))
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
  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value= {this.state.creds.username}
            onChange={this.changeHandler}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value = {this.state.creds.password}
            onChange={this.changeHandler}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
