import React, { Component } from "react";
import Button from "./Button";

class Dpad extends Component {
  constructor() {
    super();
    this.state = {
      // endpoint: "/players"
    };

    // socketClient = io(this.state.endpoint);
  }

  render() {
    // testing for socket connections

    //syntax for sending back to server
    //socketClient.emit("functionName, {my: 'data'});

    //send socketClient.id back when new player joins/react renders
    return <div style={{ textAlign: "center" }}></div>;
  }
}
export default Dpad;
