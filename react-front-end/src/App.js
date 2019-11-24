import React, { Component } from "react";
import Button from "./Button";

import io from "socket.io-client";
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
      <div style={{ textAlign: "center" }}>
        <button
          onTouchStart={() => {
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Left"
            });
          }}
          onTouchEnd={() => {
            socketClient.emit("playerMovementEnd", {
              playerID: socketClient.id,
              move: "Left"
            });
          }}
          style={{ width: "100px", height: "25px" }}
        ></button>
        <button
          onTouchStart={() => {
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Right"
            });
          }}
          onTouchEnd={() => {
            socketClient.emit("playerMovementEnd", {
              playerID: socketClient.id,
              move: "Right"
            });
          }}
          style={{ width: "100px", height: "25px" }}
        ></button>
        <button
          onTouchStart={() => {
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Up"
            });
          }}
          onTouchEnd={() => {
            socketClient.emit("playerMovementEnd", {
              playerID: socketClient.id,
              move: "Up"
            });
          }}
          style={{ width: "100px", height: "25px" }}
        ></button>
        <button
          onTouchStart={() => {
            socketClient.emit("playerMovement", {
              playerID: socketClient.id,
              move: "Down"
            });
          }}
          onTouchEnd={() => {
            socketClient.emit("playerMovementEnd", {
              playerID: socketClient.id,
              move: "Down"
            });
          }}
          style={{ width: "100px", height: "25px" }}
        ></button>
      </div>
    );
  }
}
export default App;
