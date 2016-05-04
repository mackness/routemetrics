import $ from 'jquery';
import React, { Component } from 'react';
import { Debugger } from './utils/debugger';
import TrackingButton from './components/TrackingButton';

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tracking: false
    };
  }

  _watchPosition(map, marker) {
    var positionTimer = navigator.geolocation.watchPosition(function(pos) {
      console.debug('position_updated');
      marker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      processRoughCoordinates(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    });
  }

  _setInitialPosition(map, pos) {
    map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  }

  _handleClick(event) {
    this.setState({
      tracking: !this.state.tracking
    });
  }

  _trackingState(tracking) {
    console.log(tracking);
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
    return (
      <div className="map-container">
        <div ref="map" className="map"></div>
        <TrackingButton changeTrackingState={this._trackingState.bind(this)} tracking={this.state.tracking} />
      </div>
    );
  };
}

Map.defaultProps = {};



