

<<<<<<< HEAD
var MapManager = MapManager || {};

var MapManager = {

	getCurrentLocation() {
    map = new google.maps.Map(document.getElementById('map'), {
          zoom : 17
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.monitorLocation, (err)=> {
        	console.warn('There was an error finding your location', err);
        }, {
            enableHighAccuracy : true,
            timeout : 60000,
            maximumAge : 0
        });
    } else {
        alert("Geolocation API not supported, sorry bud :/");
=======
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
>>>>>>> 48a9867609145aeceed09312d972e5059862c708
    }
	},

	monitorLocation(pos) {
		console.log(pos)
	},


	init() {
		this.getCurrentLocation();
	}

};

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', MapManager.init(), false);
=======
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

$(window).on('load', ()=> {
  if ($('#map').length) {
    navigator.geolocation.getCurrentPosition(success, error, options);
    navigator.geolocation.watchPosition(watchSuccess, watchError, options);
  }
})



>>>>>>> 48a9867609145aeceed09312d972e5059862c708
