import $ from 'jquery';
import React, { Component } from 'react';

export default class TrackingButton extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  _handleClick(event) {
    this.props.trackingState();
  }

  render() {
    if (this.props.tracking) {
      return (
        <button onClick={this._handleClick.bind(this)} className="tracking-button tracking-button--stop">STOP</button>
      );
    } else {
      return (
        <button onClick={this._handleClick.bind(this)} className="tracking-button tracking-button--start">START</button>
      );
    }
  };
}

TrackingButton.defaultProps = {};



