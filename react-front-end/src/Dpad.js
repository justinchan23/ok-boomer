import React, { Component } from "react";
import Button from "./Button";
import io from "socket.io-client";
import "./Dpad.css";
let socketClient = io("http://192.168.88.61:3001/players");

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
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          left
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
        ></Button>
        <Button
          right
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
        ></Button>
        <Button
          up
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
        ></Button>
        <Button
          down
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
        ></Button>
      </div>
    );
  }
}
export default Dpad;
