import React from "react";
import Button from "./Button";
import Dpad from "./Dpad";
import "./App.css";
import "./Dpad.css";

export default function Default(props) {
  return (
    <div>
      <div class="bombDiv">
        <Button bomb></Button>
      </div>
      <Dpad></Dpad>
    </div>
  );
}
