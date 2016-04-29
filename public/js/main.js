

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
    }
	},

	monitorLocation(pos) {
		console.log(pos)
	},


	init() {
		this.getCurrentLocation();
	}

};

document.addEventListener('DOMContentLoaded', MapManager.init(), false);