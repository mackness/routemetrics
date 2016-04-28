
function initMap(center) {a
  // Specify features and elements to define styles.
  var styleArray = [
    {
      featureType: "road",
      stylers: [
       { saturation: -100 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { hue: "#00ffee" },
        { saturation: -100 }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    scrollwheel: false,
    // Apply the map style array to the map.
    styles: styleArray,
    zoom: 18,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN
      ]
    }
  });

  var marker = new google.maps.Marker({
      position: center,
      title: 'Your Location',
      map: map
  });


	$.get('https://roads.googleapis.com/v1/snapToRoads', {
	  interpolate: true,
	  key: 'AIzaSyAOraoCS2YWp6ogkhbS8DvY88y-7H6zAdg',
	  path: '-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836',
	}, function(data) {
	  processSnapToRoadResponse(data);
	  drawSnappedPolyline();
	});

	var polylines = [];

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

	// Draws the snapped polyline (after processing snap-to-road response).
	function drawSnappedPolyline() {
	  var snappedPolyline = new google.maps.Polyline({
	    path: snappedCoordinates,
	    strokeColor: '#4d90fc',
	    strokeWeight: 2
	  });

	  snappedPolyline.setMap(map);
	  polylines.push(snappedPolyline);
	}

	// map.addListener("center_changed", function(event) {
	// 	document.querySelector('#cords').innerHTML = [map.getCenter().lat() , map.getCenter().lat()].join(', ');
	// });
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');


  var currval = $('.console').val();
  $('.console').val(currval += '\n' + 'Your current position is:\n' + 'lat ' + crd.latitude + '\n' + 'lng: ' + crd.longitude + '\n' + 'acc: ' + crd.accuracy);
	var textarea = document.querySelector('.console');
	textarea.scrollTop = textarea.scrollHeight;

  initMap({lat: crd.latitude, lng: crd.longitude});
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function watchSuccess(pos) {
  var crd = pos.coords;

  console.log('Your updated position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');

  var currval = $('.console').val();
  $('.console').val(currval += '\n' + 'Your updated position is:\n' + 'lat ' + crd.latitude + 'lng: ' + crd.longitude + '\n' + 'acc: ' + crd.accuracy);
	var textarea = document.querySelector('.console');
	textarea.scrollTop = textarea.scrollHeight;

}

function watchError(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
}

$(document).ready(function() {
	if ($('#map').length) {
		navigator.geolocation.getCurrentPosition(success, error, options);
		navigator.geolocation.watchPosition(watchSuccess, watchError, options);
	}
});


