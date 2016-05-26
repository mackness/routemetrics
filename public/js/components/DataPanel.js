import $ from 'jquery';
import React, { Component } from 'react';
import moment from 'moment';

export default class DataPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hours: '0',
      minutes: '0',
      seconds: '00'
    }
  }

  _timer() {

  }

  render() {
    return (
      <div className="data-panel">
        <div className="data-panel__cell data-panel__time">
          <span class="data-panel__text">{this.state.hours} : {this.state.minutes} : {this.state.seconds}</span>
        </div>
        <div className="data-panel__cell data-panel__speed">
          <span class="data-panel__text">{this.props.location}, {this.props.location}</span>
        </div>
        <div className="data-panel__cell data-panel__distance">
          <span class="data-panel__text">{this.props.location}, {this.props.location}</span>
        </div>
        <div className="data-panel__cell data-panel__time">
          <span class="data-panel__text">{this.props.location}, {this.props.location}</span>
        </div>
      </div>
    );
  };
}

DataPanel.defaultProps = {};



