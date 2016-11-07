
function Map (element, config) {

  this.mapReady = false;
  this.tracking = false;
  this.lat = null;
  this.lng = null;
  this.elements = {
    "mapContainer" : document.querySelector('#map')
  }

  this.init();
}

Map.prototype.getCurrentLocation = function(cb,eb) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition (
      function(position) {cb(position.coords)},
      function(error) {eb(error)}
    )
  } else {
    alert('sorry no geolocation support')
  }
}

Map.prototype.initMap = function(element, coords) {
  this.map = new google.maps.Map(element, {
    zoom: 18,
    mapTypeControl: false,
    disableDefaultUI: true,
    center: {lat: coords.latitude, lng: coords.longitude}
  });
}

Map.prototype.marker = function(coords) {
  this.marker = new google.maps.Marker({
    position: {lat: coords.latitude, lng: coords.longitude},
    map: this.map
  });
}

Map.prototype.insertControl = function(element, position) {
  console.log(this.mapReady)
  // console.log(element, position)
  // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(element);
}

Map.prototype.startTrackingButton = function() {
  console.log('this runs')
  var button = document.createElement('button');
  button.innerHTML = 'start';
  this.insertControl(button, 'BOTTOM_CENTER')
}

Map.prototype.init = function() {

  function success(coords) {
    this.initMap(this.elements.mapContainer, coords)
    this.marker(coords)
  }

  function error() {
    console.log('error')
  }

  this.getCurrentLocation(success.bind(this), error.bind(this));
}

