"use strict";

function Map() {
  this.mapReady = !1, this.tracking = !1, this.lat = null, this.lng = null, this.elements = { mapContainer: document.querySelector("#map") }, this.init();
}Map.prototype.getCurrentLocation = function (t, o) {
  "geolocation" in navigator ? navigator.geolocation.getCurrentPosition(function (o) {
    t(o.coords);
  }, function (t) {
    o(t);
  }) : alert("sorry no geolocation support");
}, Map.prototype.initMap = function (t, o) {
  this.map = new google.maps.Map(t, { zoom: 18, mapTypeControl: !1, disableDefaultUI: !0, center: { lat: o.latitude, lng: o.longitude } });
}, Map.prototype.marker = function (t) {
  this.marker = new google.maps.Marker({ position: { lat: t.latitude, lng: t.longitude }, map: this.map });
}, Map.prototype.insertControl = function () {
  console.log(this.mapReady);
}, Map.prototype.startTrackingButton = function () {
  console.log("this runs");var t = document.createElement("button");t.innerHTML = "start", this.insertControl(t, "BOTTOM_CENTER");
}, Map.prototype.init = function () {
  function t(t) {
    this.initMap(this.elements.mapContainer, t), this.marker(t);
  }function o() {
    console.log("error");
  }this.getCurrentLocation(t.bind(this), o.bind(this));
};