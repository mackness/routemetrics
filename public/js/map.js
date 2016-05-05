import $ from 'jquery';
import React, { Component } from 'react';
import { Debugger } from './utils/debugger';
import TrackingButton from './components/TrackingButton';
import DataPanel from './components/DataPanel';

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tracking: false,
      roughCoordinates: []
    };
  }

  _drawRoughPolyline(map) {
    var snappedPolyline = new google.maps.Polyline({
      path: this.state.roughCoordinates,
      strokeColor: 'red',
      strokeWeight: 3
    });
    snappedPolyline.setMap(map);
  }

  _processRoughCoordinates(map, data) {
    this.state.roughCoordinates.push(data);
    this._drawRoughPolyline(map);
  }

  _watchPosition(map, marker) {
    var positionTimer = navigator.geolocation.watchPosition((pos) => {
      marker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      if (this.state.tracking)
        this._processRoughCoordinates(map, new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    });
  }

  _setInitialPosition(map, pos) {
    map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  }

  _trackingState(tracking) {
    this.setState({
      tracking: !this.state.tracking
    });
  }

  componentDidMount() {
    var map = new google.maps.Map(this.refs.map, {
      zoom: 18,
      disableDefaultUI: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.TERRAIN
        ]
      }
    });

    //bike layer
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var locationSettings = {
      enableHighAccuracy : true,
      timeout : 60000,
      maximumAge : 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos)=> {
      var marker = new google.maps.Marker({
        map : map,
        position : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        title : "You are here",
      });
      this._setInitialPosition(map, pos);
      this._watchPosition(map, marker);
      }, (err)=> {
        alert("Your phone does not support the Geolocation API", err);
      }, locationSettings);
    } else {
      alert("Your phone does not support the Geolocation API");
    }
  }

  render() {
    var trackingActive = this.state.tracking ? 'tracking-active' : '';
    return (
      <div className={"map-container " + trackingActive}>
        <TrackingButton changeTrackingState={this._trackingState.bind(this)} tracking={this.state.tracking} />
        <div ref="map" className="map"></div>
        <DataPanel />
      </div>
    );
  };
}

Map.defaultProps = {}


