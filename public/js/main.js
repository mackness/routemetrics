
function initMap(center) {
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

  initMap({lat: crd.latitude, lng: crd.longitude});
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

$(document).ready(function() {
	navigator.geolocation.getCurrentPosition(success, error, options);
});




