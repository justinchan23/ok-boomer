import React, { useState } from "react";
import Button from "./Button";
import "./App.css";
import "./Dpad.css";
import io from "socket.io-client";
import ReactNipple from "react-nipple";

let socketClient = io("http://192.168.88.210:3001/players");

export default function Default(props) {
  const [state, setState] = useState("");
  const [colorId, setColorId] = useState("");
  const [angle, setAngle] = useState(0);
  const [data, setData] = useState(undefined);
  socketClient.on("changeColor", data => {
    setColorId(data);
  });

  const playerMoving = angle => {
    socketClient.emit("playerMovement", {
      playerId: socketClient.id,
      angle: angle
    });
  };

  return (
    <div id={colorId}>
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
      <div id={colorId}>
        <ReactNipple
          id={colorId}
          className="dpad"
          options={{
            mode: "dynamic",
            color: "black",
            position: { top: "60%", left: "50%", height: "100%", width: "100%" }
          }}
          style={{
            // outline: `1px dashed black`,
            color: "black"
          }}
          onMove={(evt, data) => {
            const handleJoystickMove = (evt, data) => {
              let angle = data.angle.degree;
              playerMoving(angle);
              setData({ data });
            };
            handleJoystickMove(evt, data);
          }}
          onEnd={() => {
            socketClient.emit("playerMovementEnd", {
              playerId: socketClient.id
            });
          }}
        />
      </div>
    </div>
  );
}
