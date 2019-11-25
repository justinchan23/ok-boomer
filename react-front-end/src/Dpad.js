import React from "react";
import Button from "./Button";
import "./App.css";

import io from "socket.io-client";
import "./Dpad.css";
let socketClient = io("http://192.168.88.61:3001/players");

export default function Dpad(props) {
  // testing for socket connections

  //syntax for sending back to server
  //socketClient.emit("functionName, {my: 'data'});

  //send socketClient.id back when new player joins/react renders
  return (
    <div class="dpad">
      <div class="UpOnly">
        <Button
          id="right"
          arrow
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
      </div>
      <div class="upDown">
        <Button
          id="up"
          arrow
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
          arrow
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
        ></Button>
      </div>
      <div class="downOnly">
        <Button
          arrow
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
        ></Button>
      </div>
    </div>
  );
}
