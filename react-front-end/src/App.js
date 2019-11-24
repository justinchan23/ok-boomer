import React, { Component } from "react";
import io from "socket.io-client";
// import { Button } from "@bit/grommet.grommet.button";
let socketClient = io("http://192.168.88.61:3001/players");

class App extends Component {
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
    return (
      <div
        style={{ textAlign: "center" }}
        onLoad={() => {
          socketClient.emit("newPlayer");
        }}
      >
        <button
          onClick={() =>
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Left"
            })
          }
        >
          Move Left
        </button>
        <button
          onClick={() =>
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Right"
            })
          }
        >
          Move Right
        </button>
        <button
          onClick={() =>
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Up"
            })
          }
        >
          Move Up
        </button>
        <button
          onClick={() =>
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Down"
            })
          }
        >
          Move Down
        </button>
      </div>
    );
  }
}
export default App;
