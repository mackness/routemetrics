

function Map (element, config) {

  this.mapReady = false;
  this.tracking = false;
  this.roughCoords = [];
  this.snappedCoords = [];
  this.watch;
  this.speed = 0;
  this.distance = 0;
  this.distanceService = new google.maps.DistanceMatrixService;
  this.elevationService =  new google.maps.ElevationService;
  this.key = 'AIzaSyDLIr5g6ySB20U-oc8-NmrfYTZhc70bMwY';
  this.geolocation = "geolocation" in navigator;
  this.elements = {
    "mapContainer" : document.querySelector('#map'),
    "layoutContainer" : document.querySelector('.layout-container'),
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

Map.prototype.formatPath = function(coords) {
  return coords.map(function(coord, i) {
    return [coord.lat(),coord.lng()].join(',')
  }).join('|')
}

Map.prototype.snapToRoads = function() {
  $.get(
    'https://roads.googleapis.com/v1/snapToRoads?path=' + this.formatPath(this.roughCoords) + '&key=' + this.key,
    function(response, status)  {
      if (status != 'success') {
        console.log('Error was: ' + status);
      } else {
        this.snappedCoords = response.snappedPoints
      }
    }.bind(this)
  );
}

Map.prototype.saveTrip = function() {
  var coords = this.snappedCoords
  var distance = this.distance
  $.post(
    '/trips',
    {
      date: Date(),
      route: coords,
      distance: distance
    },
    function(response, status) {
      if (status != 'success') {
        console.log('Error was: ' + status);
      } else {
        console.log(response)
        this.elements.saveButton.innerHTML = 'Saved';
        window.location.reload();
      }
    }.bind(this)
  )
}

Map.prototype.getDistance = function() {
  this.distanceService.getDistanceMatrix({
    origins: [this.roughCoords[0]],
    destinations: [this.roughCoords[this.roughCoords.length-1]],
    travelMode: 'BICYCLING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== 'OK') {
      console.log('Error was: ' + status);
    } else {
      //todo make sure distace object exists in the response
      this.distance = response.rows[0].elements[0].distance.text;
      this.elements.distanceElement.innerHTML = this.distance;
    }
  }.bind(this));
}

Map.prototype.getElevation = function(path, elevator, map) {
  this.elevationService.getElevationAlongPath({
    'path': path,
    'samples': 50
  }, this.plotElevation.bind(this));
}

Map.prototype.plotElevation = function(elevations, status) {

  this.elements.elevationElement.innerHTML = Math.round(elevations[elevations.length-1].elevation) + ' (m)'
  
  if (status !== 'OK') {
    this.elements.graphElement.innerHTML = 'Cannot show elevation: request failed because ' + status;
    return;
  }

  var chart = new google.visualization.LineChart(this.elements.graphElement);
  var data = new google.visualization.DataTable();
  
  data.addColumn('string', 'Sample');
  data.addColumn('number', 'Elevation');
  for (var i = 0; i < elevations.length; i++) {
    data.addRow(['', elevations[i].elevation]);
  }

  chart.draw(data, {
    height: 200,
    legend: 'none',
    titleY: 'Elevation (m)'
  });
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
    event.preventDefault();
    if (button.classList.contains('tracking-button--start')) {
      button.classList.remove('tracking-button--start')
      button.classList.add('tracking-button--stop')
      button.innerHTML = 'Stop';
      this.tracking = true;
      this.elements.body.classList.add('tracking-active')
      this.stopwatch.start();
      this.init();
    } else {

      if (this.elements.saveButton) {
        this.elements.saveButton.remove()
      }

      button.classList.remove('tracking-button--stop')
      button.classList.add('tracking-button--start')
      button.innerHTML = 'Start';
      this.tracking = false;
      this.elements.body.classList.remove('tracking-active')
      this.stopwatch.stop();
      this.init();
    }
  }.bind(this))
  this.elements['trackingButton'] = button
  this.insertMapElement(button, 'BOTTOM_CENTER')
}

Map.prototype.saveButton = function() {
  var button = document.createElement('button');
  button.classList.add('tracking-button');
  button.classList.add('tracking-button--save');
  button.innerHTML = 'Save';

  button.addEventListener('click', function(event) {
    button.innerHTML = 'Saving...'
    this.saveTrip()
  }.bind(this))

  this.elements['saveButton'] = button
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
  this.elements['stopwatchElement'] = watch
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
  this.elements['speedElement'] = speed
  return row
}

Map.prototype.distanceElement = function() {
  var distance = document.createElement('div');
  var row = document.createElement('div');
  var label = document.createElement('span');
  label.innerHTML = 'distance: ';
  label.classList.add('data-panel__label');
  row.classList.add('data-panel__row');
  distance.classList.add('data-panel__distance');
  row.appendChild(label)
  row.appendChild(distance)
  distance.innerHTML = this.distance + ' (km)';
  this.elements['distanceElement'] = distance
  return row
}

Map.prototype.elevationElement = function() {
  var elevation = document.createElement('div');
  var row = document.createElement('div');
  var label = document.createElement('span');
  label.innerHTML = 'elevation: ';
  label.classList.add('data-panel__label');
  row.classList.add('data-panel__row');
  elevation.classList.add('data-panel__elevation');
  row.appendChild(label);
  row.appendChild(elevation);
  elevation.innerHTML = this.elevation || 0 + ' (m)';
  this.elements['elevationElement'] = elevation;
  return row
}

Map.prototype.graphElement = function() {
  var graph = document.createElement('div');
  var row = document.createElement('div');
  row.classList.add('data-panel__row');
  graph.classList.add('data-panel__graph');
  row.appendChild(graph);
  this.elements['graphElement'] = graph;
  return row
}

Map.prototype.dataPanelElement = function() {
  var panel = document.createElement('div');
  panel.classList.add('data-panel');
  panel.style.top = 150 + 'px';
  panel.style.height = this.elements.layoutContainer.offsetHeight - 150 + 'px';  
  panel.appendChild(this.stopwatchElement());
  panel.appendChild(this.speedElement());
  panel.appendChild(this.distanceElement());
  panel.appendChild(this.elevationElement());
  panel.appendChild(this.graphElement());
  this.elements['dataPanelElement'] = panel;
  this.insertMapElement(panel, 'BOTTOM_RIGHT');
}

Map.prototype.init = function() {
  
  google.charts.load('current', {packages: ['corechart']});
  
  if (this.tracking) {
    
    this.saveButton();
    
    this.watchPosition (
      function(coords) {
        var location = new google.maps.LatLng(coords.latitude, coords.longitude)
        var shifted = new google.maps.LatLng(coords.latitude - 0.0008, coords.longitude)
        
        this.roughCoords.push(location)
        this.elements['speedElement'].innerHTML = Math.round(coords.speed) + ' (km/h)' || 0 + ' (km/h)';

        if (this.roughCoords.length % 10 == 0) {
          this.snapToRoads();
          this.getDistance();
          this.getElevation(this.roughCoords, this.elevator, this.map);
        }
        
        this.drawPloyline();
        this.map.panTo(shifted);
        this.marker.setPosition(location);
        this.getElevation([location,shifted], this.elevator, this.map);

      }.bind(this),

      function(error) {
        console.log('error', error)
      }
    )
  } else {
    this.getCurrentLocation (
      function (coords) {
        this.initMap(this.elements.mapContainer, coords);
        if (this.marker) {
          this.marker(coords);
        }
        this.trackingButton();
        this.dataPanelElement();
        this.stopwatch = new Stopwatch(this.watch);
      }.bind(this),

      function(error) {
        console.log('error', error)
      }
    )
  }
}

