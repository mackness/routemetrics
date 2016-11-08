
function Map (element, config) {

  this.mapReady = false;
  this.tracking = false;
  this.roughCoords = [];
  this.watch = '';
  this.speed = 0;
  this.geolocation = "geolocation" in navigator;
  this.elements = {
    "mapContainer" : document.querySelector('#map'),
    "body" : document.body
  }

  this.init();
}

Map.prototype.getCurrentLocation = function(cb,eb) {
  if (this.geolocation) {
    navigator.geolocation.getCurrentPosition (
      function(position) {cb(position.coords)},
      function(error) {eb(error)}
    )
  } else {
    alert('sorry no geolocation support')
  }
}

Map.prototype.watchPosition = function(cb,eb) {
  if (this.geolocation) {
    navigator.geolocation.watchPosition (
      function(position){cb(position.coords)},
      function(err){cb(err)}
    )
  } else {
    alert('sorry no geolocation support')
  }
}

Map.prototype.drawPloyline = function() {
  var roughPolyLine = new google.maps.Polyline({
    path: this.roughCoords,
    strokeColor: 'green',
    strokeWeight: 3
  });
  roughPolyLine.setMap(this.map);
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

Map.prototype.insertMapElement = function(element, position) {
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
      this.tracking = true;
      this.elements.body.classList.add('tracking-active')
      new Stopwatch(this.watch).start()
      this.init()
    } else {
      button.classList.remove('tracking-button--stop')
      button.classList.add('tracking-button--start')
      button.innerHTML = 'Start';
      this.tracking = false;
      this.elements.body.classList.remove('tracking-active')
      new Stopwatch(this.watch).reset()
      this.init()
    }
  }.bind(this))

  this.insertMapElement(button, 'BOTTOM_CENTER')
}

Map.prototype.stopwatchElement = function() {
  var watch = document.createElement('div');
  var row = document.createElement('div');
  var label = document.createElement('span');
  label.innerHTML = 'time: ';
  watch.innerHTML = '0:00:000';
  label.classList.add('data-panel__label');
  row.classList.add('data-panel__row');
  watch.classList.add('data-panel__stopwatch');
  row.appendChild(label)
  row.appendChild(watch)
  this.watch = watch;
  return row
}

Map.prototype.speedElement = function() {
  var speed = document.createElement('div');
  var row = document.createElement('div');
  var label = document.createElement('span');
  label.innerHTML = 'speed: ';
  speed.innerHTML = this.speed;
  label.classList.add('data-panel__label');
  row.classList.add('data-panel__row');
  speed.classList.add('data-panel__speed');
  row.appendChild(label)
  row.appendChild(speed)
  this.speed = speed;
  return row
}

Map.prototype.dataPanelElement = function() {
  var panel = document.createElement('div');
  panel.classList.add('data-panel');
  panel.appendChild(this.stopwatchElement());
  panel.appendChild(this.speedElement());
  // panel.appendChild(this.distanceElement());
  // panel.appendChild(this.elevationChangeElement());
  this.insertMapElement(panel, 'BOTTOM_RIGHT');
}

Map.prototype.init = function() {
  console.log('init:', this.tracking)
  if (this.tracking) {
    this.watchPosition(
      function(coords) {
        var location = new google.maps.LatLng(coords.latitude, coords.longitude)
        var shifted = new google.maps.LatLng(coords.latitude - 0.0008, coords.longitude)
        this.roughCoords.push(location)
        this.drawPloyline()
        this.map.panTo(shifted);
        this.speed = coords.speed || 0;
        this.speedElement()
      }.bind(this),

      function(error) {
        console.log('error', error)
      }
    )
  } else {
    this.getCurrentLocation(
      function (coords) {
        this.initMap(this.elements.mapContainer, coords);
        this.marker(coords);
        this.trackingButton();
        this.dataPanelElement();
      }.bind(this),

      function(error) {
        console.log('error', error)
      }
    )
  }
}

