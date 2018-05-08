$(document).ready(function() {
// Foursquare API Info
const clientId = "BJNMKJXYSLKY4ZGMFILFJLJEVEPHLV1VSJJKUEYCR2JBMUT5";
const clientSecret = "3W1KGSHH3NSQJPYRVNCV025DGR2XU241GO4R2VQT4UYZYEC3";
const url = "https://api.foursquare.com/v2/venues/explore?near=";




// Page Elements
const $input = $("#city");
const $submit = $("#button");
const $destination = $("#destination");
const $container = $(".container");


//AJAX Function
async function getVenues() {
  const city = $input.val();
  const urlToFetch =
    url +
    city +
    "&venuePhotos=1&limit=10&client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&v=20180430";
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      let venues = jsonResponse.response.groups[0].items.map(
        location => location.venue
      );
      return venues;
    }
  } catch (error) {
    console.log(error);
  }
}

let name = [];
let lat = [];
let lng = [];
//Submitt Function
  $("#button").click(function(event) {
    event.preventDefault();
    getVenues()
		.then(function(venues) {
			console.log(venues);
			venues.forEach(($venue, index) => {
    			name.push(venues[index].name);
    		});	
    		venues.forEach(($venue, index) => {
    			lat.push(venues[index].location.lat);
    		});
    		venues.forEach(($venue, index) => {
    			lng.push(venues[index].location.lng);
    		});
    		console.log(name);
    		console.log(lat);
    		console.log(lng);
    		getValues();
		});
  });

function getValues() {
	places = [name, lat, lng]
	console.log(places);
	for (var i = 0; i <= places.length; i++) {
		console.log(lat[i]);
		for (var j = 0; j < places[i].length; j++) {
  		marker = new L.marker([lat[i][j], lng[i][j]])
  		.addTo(mymap)
  		.bindPopup(name[i][j])
  		.openPopup();
  		}
  	}
  	/*Place 1
  	L.marker([lat[1], lng[1]])
  	.addTo(mymap)
  	.bindPopup(name[1])
  	.openPopup();
  	//Place 2
  	L.marker([lat[3], lng[3]])
  	.addTo(mymap)
  	.bindPopup(name[3])
  	.openPopup();*/
}

// Leaflet Map
let mymap = L.map("mapid").setView([51.505, -0.09], 0);

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: "mapbox.streets"
  }
).addTo(mymap);



L.circle([51.508, -0.11], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500
}).addTo(mymap);

});

