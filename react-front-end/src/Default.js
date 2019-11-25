import React from "react";
import Button from "./Button";
import Dpad from "./Dpad";
import "./App.css";
import "./Dpad.css";
import io from "socket.io-client";

let socketClient = io("http://192.168.88.61:3001/players");

export default function Default(props) {
  return (
    <div>
      <div class="bombDiv">
        <Button
          bomb
          onTouchStart={() => {
            socketClient.emit("dropBomb", {
              playerID: socketClient.id,
              move: "Drop Bomb"
            });
          }}
        ></Button>
      </div>
      <Dpad></Dpad>
    </div>
  );
}
