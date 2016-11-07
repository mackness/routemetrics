"use strict";

function Map() {
  this.mapReady = !1, this.tracking = !1, this.lat = null, this.lng = null, this.elements = { mapContainer: document.querySelector("#map"), body: document.body }, this.init();
}Map.prototype.getCurrentLocation = function (t, n) {
  "geolocation" in navigator ? navigator.geolocation.getCurrentPosition(function (n) {
    t(n.coords);
  }, function (t) {
    n(t);
  }) : alert("sorry no geolocation support");
}, Map.prototype.initMap = function (t, n) {
  this.map = new google.maps.Map(t, { zoom: 18, mapTypeControl: !1, disableDefaultUI: !0, center: { lat: n.latitude, lng: n.longitude } });
}, Map.prototype.marker = function (t) {
  this.marker = new google.maps.Marker({ position: { lat: t.latitude, lng: t.longitude }, map: this.map });
}, Map.prototype.insertControl = function (t, n) {
  this.map.controls[google.maps.ControlPosition[n]].push(t);
}, Map.prototype.trackingButton = function () {
  var t = document.createElement("button");t.classList.add("tracking-button"), t.classList.add("tracking-button--start"), t.innerHTML = "Start", t.addEventListener("click", function (n) {
    n.preventDefault(), t.classList.contains("tracking-button--start") ? (t.classList.remove("tracking-button--start"), t.classList.add("tracking-button--stop"), t.innerHTML = "Stop", this.elements.body.classList.add("tracking-active")) : (t.classList.remove("tracking-button--stop"), t.classList.add("tracking-button--start"), t.innerHTML = "Start", this.elements.body.classList.remove("tracking-active"));
  }.bind(this)), this.insertControl(t, "BOTTOM_CENTER");
}, Map.prototype.init = function () {
  function t(t) {
    this.initMap(this.elements.mapContainer, t), this.marker(t), this.trackingButton();
  }function n() {
    console.log("error");
  }this.getCurrentLocation(t.bind(this), n.bind(this));
};