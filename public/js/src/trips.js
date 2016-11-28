"use strict";

function Trips(outlets) {
	this.outlets = outlets;
	this.elements = {
		button: document.querySelectorAll('.btn-danger')
	};

	this.init();
}

Trips.prototype.initCharts = function() {

}

Trips.prototype.init = function() {
	this.initCharts();	

	$(this.elements.button).on('click', function(event) {
		event.preventDefault();
		$(this).text('Deleting')
	  $.ajax({
	    "url": '/trips/' + $(this).data('index'),
	    "type": 'DELETE',
	    "success": function(response, status) {
				console.log(response)
				$(this).closest('.trip').fadeOut()
	    }.bind(this)
	  })
	})
}
