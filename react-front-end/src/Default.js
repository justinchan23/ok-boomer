import React, { useState } from "react";
import Button from "./Button";
import "./App.css";
import "./Dpad.css";
import io from "socket.io-client";

let socketClient = io("http://192.168.88.210:3001/players");

export default function Default(props) {
  const [state, setState] = useState("");
  const [color, setColor] = useState("");

  socketClient.on("changeColor", data => {
    setColor(data);
  });
  return (
    <div id={color}>
      <div class="bombDiv">
        <Button
          bomb
          onTouchStart={() => {
            socketClient.emit("dropBomb", {
              playerId: socketClient.id,
              move: "Drop Bomb"
            });
          }}
        ></Button>
      </div>
      <div class="dpad" id={color}>
        <div class="UpOnly">
          <Button
            id="right"
            arrow
            onTouchStart={() => {
              socketClient.emit("playerMovement", {
                playerId: socketClient.id,
                move: "Right"
              });
            }}
            onTouchEnd={() => {
              socketClient.emit("playerMovementEnd", {
                playerId: socketClient.id,
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
                playerId: socketClient.id,
                move: "Up"
              });
            }}
            onTouchEnd={() => {
              socketClient.emit("playerMovementEnd", {
                playerId: socketClient.id,
                move: "Up"
              });
            }}
          ></Button>
          <Button
            arrow
            id="down"
            onTouchStart={() => {
              socketClient.emit("playerMovement", {
                playerId: socketClient.id,
                move: "Down"
              });
            }}
            onTouchEnd={() => {
              socketClient.emit("playerMovementEnd", {
                playerId: socketClient.id,
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
                playerId: socketClient.id,
                move: "Left"
              });
            }}
            onTouchEnd={() => {
              socketClient.emit("playerMovementEnd", {
                playerId: socketClient.id,
                move: "Left"
              });
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}
