// Foursquare API Info
const clientId = "BJNMKJXYSLKY4ZGMFILFJLJEVEPHLV1VSJJKUEYCR2JBMUT5";
const clientSecret = "3W1KGSHH3NSQJPYRVNCV025DGR2XU241GO4R2VQT4UYZYEC3";
const url = "https://api.foursquare.com/v2/venues/explore?near=";

// Page Elements
const $input = $("#city");
const $submit = $("#button");

//AJAX Function
async function getVenues() {
  const city = $input.val();
  const urlToFetch =
    url +
    city +
    "&limit=10&client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&v=20180430";
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
    	getTips();
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      let venues = jsonResponse.response.groups[0].items.map(
        location => location.venue
      );
      return venues;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getTips() {
  const urlToFetch =
    tipsUrl +
    id[0] + "/tips?client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&v=20180430";
  try {
    let response = await fetch(urlToFetch);
    if (response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      let tips = jsonResponse.response.tips.items.map(
        text => text.text
      );
      console.log(tips);
      return tips;
    }
  }
  catch (error) {
    console.log(error);
  } 
}

let bestTip = [];
let id = [];
console.log(id);
let address = [];
let name = [];
let lat = [];
let lng = [];
//Submitt Function
$("#button").click(function(event) {
  event.preventDefault();
  getVenues().then(function(venues) {
    console.log(venues);
    venues.forEach((venue, index) => {
      name.push(venues[index].name);
    });
    venues.forEach((venue, index) => {
      lat.push(venues[index].location.lat);
    });
    venues.forEach((venue, index) => {
      lng.push(venues[index].location.lng);
    });
    venues.forEach((venue, index) => {
      address.push(venues[index].location.address);
    });
    venues.forEach((venue, index) => {
      id.push(venues[index].id);
    });
    getTips().then(function(tips) {
    	bestTip.push(tips);
  	});
    getValues();
  });
});

// Leaflet Map
 var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});
var blackWhite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

var star = L.icon({
    iconUrl: 'star.png',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

let mymap = L.map("mapid",{
	center: [51.505, -0.09], 
	zoom: 10, 
	layers: [blackWhite]
});

var baseMaps = {
	"Watercolor": watercolor,
	"Black and Whte": blackWhite,
	"Terrian": terrain
};

L.control.layers(baseMaps).addTo(mymap);

mymap.panTo(new L.LatLng([lat, lng]), 13);

//Markers
function getValues() {
  places = [name, lat, lng, address];
  for (let i = 0; i < places.length; i++) {
    for (let j = 0; j < places[i].length; j++) {
      marker = new L.marker([places[1][j], places[2][j]], {icon: star})
        .addTo(mymap)
        .bindPopup("<b>" + places[0][j] + "</b><br>" + places[3][j] + "<br>" + bestTip[0])
        .openPopup();
    }
  }
}
