import React, { Component } from "react";

class Button extends Component {
  constructor() {
    super();
    this.state = {
      // endpoint: "/players"
    };

    // socketClient = io(this.state.endpoint);
  }

  render() {
    return (
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
    );
  }
}

export default Button;
