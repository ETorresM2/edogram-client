import React from "react";
import Login from "./components/login";
import Landing from "./components/landing";
import Dashboard from "./components/dashboard";
import Chat from "./components/chat"
import { BrowserRouter, Route, Link } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  pullUserFromLogin=(childData) => {
    this.setState({user: childData})
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </div>
          <Route exact path="/" component={Landing} />
          <Route path="/chat" component={Chat} />
          <Route path="/login" render={props => <Login {...props} callback={this.pullUserFromLogin}/>} />
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
