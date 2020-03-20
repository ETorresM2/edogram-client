import React from "react";
import Login from "./components/login";
import Landing from "./components/landing";
import Dashboard from "./components/dashboard";
import Chat from "./components/chat";
// eslint-disable-next-line
import "./components/style/app.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

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

  render() {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <div>
            <nav>
              <Link to="/">Home</Link>

              <Link to="/login">Login</Link>
              <button class="logout">Logout</button>
            </nav>
          </div>
          <Route exact path="/" component={Landing} />
          <Route path="/chat/:receiver" component={Chat} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} callback={this.pullUserFromLogin} />
            )}
          />
          <Route
            path="/dashboard"
            render={props => <Dashboard {...props} user={this.state.user} />}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
