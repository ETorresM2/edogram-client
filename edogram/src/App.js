import React from "react";
import Login from "./components/login";
import Landing from "./components/landing";
import Dashboard from "./components/dashboard";
import axios from "axios"
import Chat from "./components/chat";
import "./components/style/app.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  pullUserFromLogin = childData => {
    this.setState({ user: childData });
  };

  logoutHandler = event => {
    console.log("logging out")
    localStorage.clear()
    axios
    .get(
      `https://edgram.herokuapp.com/logout`
    )
    this.props.history.push("/")
    window.location.reload(false);
  }

  render() {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <div>
            <nav>
              <Link to="/">Home</Link>

              <Link to="/login">Login</Link>
              <button onClick={this.logoutHandler} className="logout">Logout</button>
            </nav>
          </div>
          <Route exact path="/" component={Landing} />
          <div className = "dashWrapper">
          <Route
            path="/dashboard"
            render={props => <Dashboard {...props} user={this.state.user} />}
          />
          <Route path="/dashboard/chat/:receiver" component={Chat} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} callback={this.pullUserFromLogin} />
            )}
          />
          </div>

        </BrowserRouter>
      </div>
    );
  }
}

export default withRouter(App);
