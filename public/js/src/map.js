
function Map (element, config) {

  this.mapReady = false;
  this.tracking = false;
  this.lat = null;
  this.lng = null;
  this.elements = {
    "mapContainer" : document.querySelector('#map'),
    "body" : document.body
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
  this.map.controls[google.maps.ControlPosition[position]].push(element);
}

Map.prototype.trackingButton = function() {
  var button = document.createElement('button');
  button.classList.add('tracking-button');
  button.classList.add('tracking-button--start');
  button.innerHTML = 'Start';

  button.addEventListener('click', function(event) {
    event.preventDefault()
    if (button.classList.contains('tracking-button--start')) {
      button.classList.remove('tracking-button--start')
      button.classList.add('tracking-button--stop')
      button.innerHTML = 'Stop';
      this.elements.body.classList.add('tracking-active')
    } else {
      button.classList.remove('tracking-button--stop')
      button.classList.add('tracking-button--start')
      button.innerHTML = 'Start';
      this.elements.body.classList.remove('tracking-active')
    }
  }.bind(this))

  this.insertControl(button, 'BOTTOM_CENTER')
}

Map.prototype.init = function() {

  function success(coords) {
    this.initMap(this.elements.mapContainer, coords)
    this.marker(coords)
    this.trackingButton()
  }

  function error() {
    console.log('error')
  }

  this.getCurrentLocation(success.bind(this), error.bind(this));
}

