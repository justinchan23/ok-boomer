import React, { Component } from "react";
import io from "socket.io-client";
// import { Button } from "@bit/grommet.grommet.button";
let socketClient;

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://192.168.88.84:3001"
    };

    socketClient = io(this.state.endpoint);
  }

  render() {
    // testing for socket connections

    //syntax for sending back to server
    //socketClient.emit("functionName, {my: 'data'});

    //send socketClient.id back when new player joins/react renders
    return (
      <div style={{ textAlign: "center" }} onLoad={() => {}}>
        <button onClick={() => socketClient.emit("Left", socketClient.id)}>
          Move Left
        </button>
        <button onClick={() => socketClient.emit("Right", socketClient.id)}>
          Move Right
        </button>
        <button onClick={() => socketClient.emit("Up", socketClient.id)}>
          Move Up
        </button>
        <button onClick={() => socketClient.emit("Down", socketClient.id)}>
          Move Down
        </button>
      </div>
    );
  }
}
export default App;
