import React, { Component } from "react";
import Dpad from "./Dpad";
import Button from "./Button";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <div class="bombDiv">
          <Button bomb>Bomb</Button>
        </div>
        <div class="dpad">
          <Dpad></Dpad>
        </div>
      </div>
    );
  }
}
export default App;
