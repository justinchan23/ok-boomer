import React, { Component } from "react";
import Button from "./Button";
import "./App.css";
import io from "socket.io-client";
import "./Dpad.css";
let socketClient = io("http://192.168.88.61:3001/players");

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <div class="bombDiv">
          <Button bomb></Button>
        </div>
        <div class="dpad">
          <div class="UpOnly">
            <button
              class="buttonArrow"
              id="right"
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
            ></button>
          </div>
          <div class="upDown">
            <button
              class="buttonArrow"
              id="up"
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
            ></button>
            <button
              class="buttonArrow"
              id="down"
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
            ></button>
          </div>
          <div class="downOnly">
            <button
              class="buttonArrow"
              id="left"
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
            ></button>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
