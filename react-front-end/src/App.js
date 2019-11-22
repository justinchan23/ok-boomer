import React, { Component } from "react";
import io from "socket.io-client";
// import { Button } from "@bit/grommet.grommet.button";

const socket = io("http://192.168.88.84:3001");

class App extends Component {
  constructor() {
    super();
    this.state = {
      player: ""
    };
  }

  render() {
    // testing for socket connections
    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => socket.emit("newPlayer")}>New Player</button>
        <button onClick={() => socket.emit("Left")}>Move Left</button>
        <button onClick={() => socket.emit("Right")}>Move Right</button>
        <button onClick={() => socket.emit("Up")}>Move Up</button>
        <button onClick={() => socket.emit("Down")}>Move Down</button>
      </div>
    );
  }
}
export default App;
