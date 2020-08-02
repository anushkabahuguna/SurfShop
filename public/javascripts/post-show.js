
mapboxgl.accessToken = 'pk.eyJ1IjoiYW51c2hrYWJhaHVndW5hIiwiYSI6ImNrY2F0Mmt3ZTF5bGUydG8wb20xcm44ZHoifQ.UtZYdlNq7Na06vmHIQRlaA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: post.coordinates,
  zoom: 7
});

	/*
var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-77.032, 38.913]
    },
    properties: {
      title: 'Mapbox',
      description: 'Washington, D.C.'
    }
  }]
};
*/
	
// add markers to map
// geojson.features.forEach(function(marker) {

  // create a HTML element for our post location/marker
 var el = document.createElement('div');
 el.className = 'marker';

  // make a marker for our location and add to the map
 new mapboxgl.Marker(el)
   .setLngLat(post.coordinates)
   .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
   .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
   .addTo(map);
// });


// for toggling the edit form on and off

	
	// add a click listener for our edit button
	$(".toggle-edit-form").on("click", function(){

// 	toggle the text for button change to cancel or edit
	
	$(this).text() === "Edit" ? ($(this).text("Cancel")) : ($(this).text("Edit"));
	
//  toggle visibility of the form 
		
	$(this).siblings(".edit-review-form").toggle();
		
	});


// here we will add code for clear button
// add click listener to clear the rating for new and edit
$(".clear-rating").click(function(){
	$(this).siblings(".input-no-rate").click();
});






