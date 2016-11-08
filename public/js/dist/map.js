"use strict";

function Map() {
  this.mapReady = !1, this.tracking = !1, this.roughCoords = [], this.watch = "", this.speed = 0, this.geolocation = "geolocation" in navigator, this.elements = { mapContainer: document.querySelector("#map"), body: document.body }, this.init();
}Map.prototype.getCurrentLocation = function (t, e) {
  this.geolocation ? navigator.geolocation.getCurrentPosition(function (e) {
    t(e.coords);
  }, function (t) {
    e(t);
  }) : alert("sorry no geolocation support");
}, Map.prototype.watchPosition = function (t) {
  this.geolocation ? navigator.geolocation.watchPosition(function (e) {
    t(e.coords);
  }, function (e) {
    t(e);
  }) : alert("sorry no geolocation support");
}, Map.prototype.drawPloyline = function () {
  var t = new google.maps.Polyline({ path: this.roughCoords, strokeColor: "green", strokeWeight: 3 });t.setMap(this.map);
}, Map.prototype.initMap = function (t, e) {
  this.map = new google.maps.Map(t, { zoom: 18, mapTypeControl: !1, disableDefaultUI: !0, center: { lat: e.latitude, lng: e.longitude } });
}, Map.prototype.marker = function (t) {
  this.marker = new google.maps.Marker({ position: { lat: t.latitude, lng: t.longitude }, map: this.map });
}, Map.prototype.insertMapElement = function (t, e) {
  this.map.controls[google.maps.ControlPosition[e]].push(t);
}, Map.prototype.trackingButton = function () {
  var t = document.createElement("button");t.classList.add("tracking-button"), t.classList.add("tracking-button--start"), t.innerHTML = "Start", t.addEventListener("click", function (e) {
    e.preventDefault(), t.classList.contains("tracking-button--start") ? (t.classList.remove("tracking-button--start"), t.classList.add("tracking-button--stop"), t.innerHTML = "Stop", this.tracking = !0, this.elements.body.classList.add("tracking-active"), new Stopwatch(this.watch).start(), this.init()) : (t.classList.remove("tracking-button--stop"), t.classList.add("tracking-button--start"), t.innerHTML = "Start", this.tracking = !1, this.elements.body.classList.remove("tracking-active"), new Stopwatch(this.watch).reset(), this.init());
  }.bind(this)), this.insertMapElement(t, "BOTTOM_CENTER");
}, Map.prototype.stopwatchElement = function () {
  var t = document.createElement("div"),
      e = document.createElement("div"),
      n = document.createElement("span");return n.innerHTML = "time: ", t.innerHTML = "0:00:000", n.classList.add("data-panel__label"), e.classList.add("data-panel__row"), t.classList.add("data-panel__stopwatch"), e.appendChild(n), e.appendChild(t), this.watch = t, e;
}, Map.prototype.speedElement = function () {
  var t = document.createElement("div"),
      e = document.createElement("div"),
      n = document.createElement("span");return n.innerHTML = "speed: ", t.innerHTML = this.speed, n.classList.add("data-panel__label"), e.classList.add("data-panel__row"), t.classList.add("data-panel__speed"), e.appendChild(n), e.appendChild(t), this.speed = t, e;
}, Map.prototype.dataPanelElement = function () {
  var t = document.createElement("div");t.classList.add("data-panel"), t.appendChild(this.stopwatchElement()), t.appendChild(this.speedElement()), this.insertMapElement(t, "BOTTOM_RIGHT");
}, Map.prototype.init = function () {
  console.log("init:", this.tracking), this.tracking ? this.watchPosition(function (t) {
    var e = new google.maps.LatLng(t.latitude, t.longitude),
        n = new google.maps.LatLng(t.latitude - 8e-4, t.longitude);this.roughCoords.push(e), this.drawPloyline(), this.map.panTo(n), this.speed = t.speed || 0, this.speedElement();
  }.bind(this), function (t) {
    console.log("error", t);
  }) : this.getCurrentLocation(function (t) {
    this.initMap(this.elements.mapContainer, t), this.marker(t), this.trackingButton(), this.dataPanelElement();
  }.bind(this), function (t) {
    console.log("error", t);
  });
};