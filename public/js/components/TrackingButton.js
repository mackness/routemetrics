import $ from 'jquery';
import React, { Component } from 'react';

export default class TrackingButton extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  handleClick(event) {
    this.props.changeTrackingState()
  },

  render() {
    if (this.props.tracking) {
      return (
        <button onClick={this.handleClick.bind(this)} className="tracking-button tracking-button--stop">STOP</button>
      );
    } else {
      return (
        <button  className="tracking-button tracking-button--start">START</button>
      );
    }
  };
}

TrackingButton.defaultProps = {};



