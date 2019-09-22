import React from "react";

import axios from "axios";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  componentDidMount = () => {
    this.setState([this.state.user, this.props.user]);
    
  }


  render() {
    return (
      <div>
        <h1>Welcome to Dashboard</h1>

        <p>Name: {this.props.user.username} </p>
      </div>
    );
  }
}

export default Dashboard;
