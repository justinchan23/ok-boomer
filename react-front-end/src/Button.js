import React, { Component } from "react";
let classNames = require("classnames");

class Button extends Component {
  constructor() {
    super();
    this.state = {
      // endpoint: "/players"
    };
  }

  render() {
    const buttonClass = classNames("button", {
      "button--left": this.props.left,
      "button--right": this.props.right,
      "button--down": this.props.down,
      "button--up": this.props.up,
      "button--bomb": this.props.bomb
    });
    return (
      <button
        className={buttonClass}
        onTouchStart={this.props.onTouchStart}
        onTouchEnd={this.props.onTouchEnd}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
