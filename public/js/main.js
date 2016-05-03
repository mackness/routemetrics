
$(document).ready(function() {
  if (document.querySelector('#map')) {
	 initLocationProcedure();
	 //drawingManager();
  }
});

var map;
var drawingManager;
var placeIdArray = [];
var polylines = [];
var snappedCoordinates = [];
var roughCoordinates = [];
var currentPos = {};
var API_KEY = 'AIzaSyAOraoCS2YWp6ogkhbS8DvY88y-7H6zAdg';

///debugging
function debugging(msg) {
    var currval = $('.console').val();
    $('.console').val(currval +=  msg );
    var textarea = document.querySelector('.console');
    textarea.scrollTop = textarea.scrollHeight;
}
///debugging

function initLocationProcedure() {
    //init map
    map = new google.maps.Map(document.getElementById('map'), {
      zoom : 17,
     mapTypeControl: true,
     streetViewControl: false,
     zoomControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.TERRAIN,
          google.maps.MapTypeId.SATELLITE
        ]
      }
      // styles: window.map_themes.dark
    });

    //add bike layer
		var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(map);

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

    //loaded callback
    google.maps.event.addListenerOnce(map, 'idle', ()=> {
      console.debug('map_loaded');
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayAndWatch, locError, {
            enableHighAccuracy : true,
            timeout : 60000,
            maximumAge : 0
        });
    } else {
        alert("Your phone does not support the Geolocation API");
    }
}

function locError(error) {
	// the current position could not be located
	alert("The current position could not be found!");
}

function drawingManager() {
  // Enables the polyline drawing control. Click on the map to start drawing a
  // polyline. Each click will add a new vertice. Double-click to stop drawing.
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYLINE
      ]
    },
    polylineOptions: {
      strokeColor: 'yellow',
      strokeWeight: 2
    }
  });
  drawingManager.setMap(map);

   drawingManager.addListener('polylinecomplete', function(poly) {
    var path = poly.getPath();
    polylines.push(poly);
    placeIdArray = [];
    runSnapToRoad(path);
  });
}
	
function runSnapToRoad(path) {
  var self = this;
  console.log('[path]', path);
  var pathValues = [];
  for (var i = 0; i < path.getLength(); i++) {
    pathValues.push(path.getAt(i).toUrlValue());
  }

  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: API_KEY,
    path: pathValues.join('|')
  }, (data)=> {
    processSnapToRoadResponse(data);
    drawSnappedPolyline();
  });
}

function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: 'black',
    strokeWeight: 3
  });

  snappedPolyline.setMap(map);
  polylines.push(snappedPolyline);
}

function drawRoughPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: roughCoordinates,
    strokeColor: '#2ecc71',
    strokeWeight: 3
  });

  snappedPolyline.setMap(map);
}

function processRoughCoordinates(data) {
  // debugging('\n' + data, + roughCoordinates.push(data) + '\n');
  roughCoordinates.push(data);
  drawRoughPolyline();
}

// Store snapped polyline returned by the snap-to-road method.
function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  placeIdArray = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
        data.snappedPoints[i].location.latitude,
        data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
  }
}

function displayAndWatch(position) {
    // set current position
    setUserLocation(position);
    // watch position
    watchCurrentPosition();
}

function setUserLocation(pos) {
  // marker for userLocation
  userLocation = new google.maps.Marker({
   map : map,
   position : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
   title : "You are here",
   // icon: 'http://localhost:3000/img/marker.svg'
	});
  
  // pan to updated location
  map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

  // recenter after moving
  // map.addListener('center_changed', function(data) {
  //   console.log(map.getCenter());
  //   processRoughCoordinates(map.getCenter());
  // });

  // debugging('\n' + 'Your position is:\n' + 'lat ' + pos.coords.latitude + 'lng: ' + pos.coords.longitude + '\n' + 'acc: ' + pos.coords.accuracy + '\n' + 'spd: ' + pos.coords.speed);
}

function watchCurrentPosition() {
    var positionTimer = navigator.geolocation.watchPosition(function(pos) {
        setMarkerPosition(userLocation, pos);
        map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        processRoughCoordinates(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    });
}

function setMarkerPosition(marker, pos) {
    marker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    // debugging('\n' + 'Your updated position is:\n' + 'lat ' + pos.coords.latitude + 'lng: ' + pos.coords.longitude + '\n' + 'acc: ' + pos.coords.accuracy + '\n' + 'spd: ' + pos.coords.speed)
}

// document.addEventListener('click', (event)=> {
//   event.preventDefault();
//   event.stopPropagation();
//   initLocationProcedure();
//   DrawingManager();  
// });


