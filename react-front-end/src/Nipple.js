// import React, { useState } from "react";
// import ReactNipple from "react-nipple";
import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactNipple from "react-nipple";
import DebugView from "react-nipple/lib/DebugView";

export default class ReactNippleExample extends Component {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    options: PropTypes.object
  };
  state = {
    data: undefined
  };
  render() {
    return (
      <div className="NippleExample">
        <h2>{this.props.title}</h2>
        <ReactNipple
          className="joystick"
          options={this.props.options}
          style={{
            outline: `1px dashed ${this.props.options.color}`,
            width: this.props.width,
            height: this.props.height
          }}
          onMove={() => this.handleJoystickMove}
        />
        <DebugView data={this.state.data} />
      </div>
    );
  }
  handleJoystickMove = (evt, data) => {
    this.setState({ data });
  };
}
