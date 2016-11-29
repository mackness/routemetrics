"use strict";

function Trips(outlets) {
	this.outlets = outlets;
	this.path = [];
	this.elevationService =  new google.maps.ElevationService;
	this.elements = {
		button: document.querySelectorAll('.btn-danger')
	};

	this.init();
}

Trips.prototype.getElevationPoints = function() {
  this.elevationService.getElevationAlongPath({
    'path': this.path,
    'samples': 50
  }, this.plotElevation.bind(this));
}

Trips.prototype.plotElevation = function(elevations, status) {
	console.log(elevations, status)
	console.log(this.outlet)

  if (status !== 'OK') {
    this.outlet.innerHTML = 'Cannot show elevation: request failed because ' + status;
    return;
  }
 
	var chart = new google.visualization.LineChart(this.outlet);
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

Trips.prototype.constructPath = function() {
	Array.prototype.forEach.call(this.outlets, function(trip, i) {
		if (trip.dataset.route != 0) {
			JSON.parse(trip.dataset.route).forEach(function(coords, i) {
				this.path.push({
					lat: +coords.location.latitude,
					lng: +coords.location.longitude,
				})
			}.bind(this))
			this.outlet = trip
			this.getElevationPoints()
		}
	}.bind(this))
}

Trips.prototype.init = function() {

  google.charts.load('current', {packages: ['corechart']});

  google.charts.setOnLoadCallback(function(){
		this.constructPath();	

		$(this.elements.button).on('click', function(event) {
			event.preventDefault();
			$(this).text('Deleting')
		  $.ajax({
		    "url": '/trips/' + $(this).data('index'),
		    "type": 'DELETE',
		    "success": function(response, status) {
				$(this).closest('.trip').fadeOut()
		    }.bind(this)
		  })
		})
  }.bind(this));
}
