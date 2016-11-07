import $ from 'jquery';
import React, { Component } from 'react';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';

export default class DataPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stopwatch: '',
    }
    this.timer = new Stopwatch();
    this.start = this.timer.start();
    this.stop = this.timer.stop();
    this.reset = this.timer.reset();
  }

  startStopwatch() {
    
  }

  stopStopwatch() {
    this.timer.stop();
    this.timer.reset();
    // this.setState({
    //   stopwatch: '0:00:00'
    // })
  }

  render() {
    this.props.tracking ? this.startStopwatch() : this.stopStopwatch();
    return (
      <div className="data-panel">
        <div className="data-panel__cell data-panel__time">
          <span className="data-panel__text">{this.state.stopwatch}</span>
        </div>
        <div className="data-panel__cell data-panel__speed">
          <span className="data-panel__text">{this.props.speed || 0}</span>
        </div>
        <div className="data-panel__cell data-panel__distance">
          <span className="data-panel__text">{this.props.location}, {this.props.location}</span>
        </div>
        <div className="data-panel__cell data-panel__time">
          <span className="data-panel__text">{this.props.location}, {this.props.location}</span>
        </div>
      </div>
    );
  };
}

DataPanel.defaultProps = {};



