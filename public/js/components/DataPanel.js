import $ from 'jquery';
import React, { Component } from 'react';

export default class DataPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="data-panel">
        <div className="data-panel__cell data-panel__time">10:00</div>
        <div className="data-panel__cell data-panel__speed">10:00</div>
        <div className="data-panel__cell data-panel__distance">10:00</div>
        <div className="data-panel__cell data-panel__time">10:00</div>
      </div>
    );
  };
}

DataPanel.defaultProps = {};



