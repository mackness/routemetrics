import $ from 'jquery';
import React, { Component } from 'react';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';

export default class DataPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stopwatch: '',
      reset: '0:00:00'
    }
  }

  start() {
    // var timer = new Stopwatch();
    // timer.start();
    setInterval(()=> {
      var hours = Math.floor(timer.ms / (60 * 60 * 1000))
      var minutes = Math.floor(timer.ms / (60 * 1000))
      var seconds = Math.floor(timer.ms / 1000)
      var time = [hours,minutes,seconds].join(':')
      console.log(time)
      this.setState({stopwatch: time})
    },500)
  }

  stop() {

  }

  render() {
    this.props.tracking ? this.start() : this.stop();
    return (
      <div className="data-panel">
        <div className="data-panel__cell data-panel__time">
          <span className="data-panel__text">{this.props.tracking ? this.state.stopwatch : this.state.reset }</span>
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



