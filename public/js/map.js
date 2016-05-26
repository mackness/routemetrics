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
      roughCoordinates: [],
      map: {},
      marker: {},
      location: []
    };
  }

  _drawRoughPolyline(map) {
    var roughPolyLine = new google.maps.Polyline({
      path: this.state.roughCoordinates,
      strokeColor: 'red',
      strokeWeight: 3
    });
    roughPolyLine.setMap(map);
  }

  _processRoughCoordinates(map, data) {
    this.state.roughCoordinates.push(data);
    this._drawRoughPolyline(map);
  }

  _watchPosition(map, marker) {
    var position = navigator.geolocation.watchPosition((pos) => {
      marker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      this.setState({
        location: [pos.coords.latitude, pos.coords.longitude]
      });
      if (this.state.tracking) {
        this._processRoughCoordinates(map, new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      }
    });
  }

  _centerMap() {
    let map = this.state.map,
        marker = this.state.marker;
    setTimeout(()=> {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      if (typeof center == 'object') {
        map.panTo(center);
      }
    },200) // run when css animation finishes
  }

  _setInitialPosition(map, pos) {
    map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  }

  _trackingState(tracking) {
    this._centerMap();
    this.setState({
      tracking: !this.state.tracking
    });
  }

  componentDidMount() {
    this.state.map = new google.maps.Map(this.refs.map, {
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
    bikeLayer.setMap(this.state.map);

    var locationSettings = {
      enableHighAccuracy : true,
      timeout : 60000,
      maximumAge : 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos)=> {
      this.state.marker = new google.maps.Marker({
        map : this.state.map,
        position : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        title : "You are here",
      });
      this.setState({
        location: [pos.coords.latitude, pos.coords.longitude]
      });
      this._setInitialPosition(this.state.map, pos);
      this._watchPosition(this.state.map, this.state.marker);
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
        <TrackingButton changeTrackingState={this._trackingState.bind(this)} tracking={this.state.tracking} map={this.state.map} />
        <div ref="map" className="map"></div>
        <DataPanel location={this.state.location}/>
      </div> 
    );
  };
}

Map.defaultProps = {}


