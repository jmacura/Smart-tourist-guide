

//TODO: Hydda not loading
var Hydda = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
});

var OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org" target="_blank">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
});

var mypoints = new L.LayerGroup();

var baseMaps = {
	//"Hydda": Hydda,
	"OpenStreetMap Carto": OpenStreetMap,
	"OpenCycleMap": OpenCycleMap
};

var overlayMaps = {
	//   "My Points": mypoints,
};

var mymap = new L.Map('mapid', {
	layers: [OpenStreetMap],
	center: [49.75, 13.35],
	zoom: 13,
	fullscreenControl: true
});

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(mymap);

var greenIcon = new L.Icon({
	iconUrl: 'icons/green.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var redIcon = new L.Icon({
	iconUrl: 'icons/red.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
	iconUrl: 'icons/blue.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var purpleIcon = new L.Icon({
	iconUrl: 'icons/purple.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});


var orangeIcon = new L.Icon({
	iconUrl: 'icons/orange.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: 'icons/yellow.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
	iconUrl: 'icons/grey.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var azureIcon = new L.Icon({
	iconUrl: 'icons/azure.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var ochreIcon = new L.Icon({
	iconUrl: 'icons/ochre.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var pinkIcon = new L.Icon({
	iconUrl: 'icons/pink.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: 'icons/black.png',
	shadowUrl: 'icons/shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var markersCluster = L.markerClusterGroup();

var transportation = new L.LayerGroup().addTo(mymap);
var foodAndDrink = new L.LayerGroup().addTo(mymap);
var carService = new L.LayerGroup().addTo(mymap);
var cultureAndEntertainment = new L.LayerGroup().addTo(mymap);
var lodging = new L.LayerGroup().addTo(mymap);
var naturalFeature = new L.LayerGroup().addTo(mymap);
var other = new L.LayerGroup().addTo(mymap);
var outdoor = new L.LayerGroup().addTo(mymap);
var professionalAndPublic = new L.LayerGroup().addTo(mymap);
var shoppingAndService = new L.LayerGroup().addTo(mymap);

var transportation2 = new L.LayerGroup();
var foodAndDrink2 = new L.LayerGroup();
var carService2 = new L.LayerGroup();
var cultureAndEntertainment2 = new L.LayerGroup();
var lodging2 = new L.LayerGroup();
var naturalFeature2 = new L.LayerGroup();
var other2 = new L.LayerGroup();
var outdoor2 = new L.LayerGroup();
var professionalAndPublic2 = new L.LayerGroup();
var shoppingAndService2 = new L.LayerGroup();

var selectAll = new L.LayerGroup().addTo(mymap);
var bug = new L.LayerGroup().addTo(mymap);

var num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0, num8 = 0, num9 = 0, num10 = 0;

mymap.on('overlayremove', function (eo) {
	if (eo.layer === selectAll) {
		mymap.removeLayer(transportation);
		mymap.removeLayer(foodAndDrink);
		mymap.removeLayer(carService);
		mymap.removeLayer(cultureAndEntertainment);
		mymap.removeLayer(lodging);
		mymap.removeLayer(naturalFeature);
		mymap.removeLayer(other);
		mymap.removeLayer(outdoor);
		mymap.removeLayer(professionalAndPublic);
		mymap.removeLayer(shoppingAndService);
		layerControl.removeLayer(bug);
	} else if (eo.layer === transportation) {
		removeLayer(markersCluster, transportation2);
	} else if (eo.layer === foodAndDrink) {
		removeLayer(markersCluster, foodAndDrink2);
	} else if (eo.layer === carService) {
		removeLayer(markersCluster, carService2);
	} else if (eo.layer === cultureAndEntertainment) {
		removeLayer(markersCluster, cultureAndEntertainment2);
	} else if (eo.layer === lodging) {
		removeLayer(markersCluster, lodging2);
	} else if (eo.layer === naturalFeature) {
		removeLayer(markersCluster, naturalFeature2);
	} else if (eo.layer === other) {
		removeLayer(markersCluster, other2);
	} else if (eo.layer === outdoor) {
		removeLayer(markersCluster, outdoor2);
	} else if (eo.layer === professionalAndPublic) {
		removeLayer(markersCluster, professionalAndPublic2);
	} else if (eo.layer === shoppingAndService) {
		removeLayer(markersCluster, shoppingAndService2);
	}
});

mymap.on('overlayadd', function (eo) {
	if (eo.layer === selectAll) {
		mymap.addLayer(transportation);
		mymap.addLayer(foodAndDrink);
		mymap.addLayer(carService);
		mymap.addLayer(cultureAndEntertainment);
		mymap.addLayer(lodging);
		mymap.addLayer(naturalFeature);
		mymap.addLayer(other);
		mymap.addLayer(outdoor);
		mymap.addLayer(professionalAndPublic);
		mymap.addLayer(shoppingAndService);
		layerControl.removeLayer(bug);
	} else if (eo.layer === transportation) {
		addLayer(markersCluster, transportation2);
	} else if (eo.layer === foodAndDrink) {
		addLayer(markersCluster, foodAndDrink2);
	} else if (eo.layer === carService) {
		addLayer(markersCluster, carService2);
	} else if (eo.layer === cultureAndEntertainment) {
		addLayer(markersCluster, cultureAndEntertainment2);
	} else if (eo.layer === lodging) {
		addLayer(markersCluster, lodging2);
	} else if (eo.layer === naturalFeature) {
		addLayer(markersCluster, naturalFeature2);
	} else if (eo.layer === other) {
		addLayer(markersCluster, other2);
	} else if (eo.layer === outdoor) {
		addLayer(markersCluster, outdoor2);
	} else if (eo.layer === professionalAndPublic) {
		addLayer(markersCluster, professionalAndPublic2);
	} else if (eo.layer === shoppingAndService) {
		addLayer(markersCluster, shoppingAndService2);
	}
});


function removeLayer(cluster, layer) {
	cluster.removeLayer(layer);
}
function addLayer(cluster, layer) {
	cluster.addLayer(layer);
}

function refreshLayer(center) {
	layerControl.removeLayer(selectAll);
	layerControl.removeLayer(transportation);
	layerControl.removeLayer(foodAndDrink);
	layerControl.removeLayer(carService);
	layerControl.removeLayer(cultureAndEntertainment);
	layerControl.removeLayer(lodging);
	layerControl.removeLayer(naturalFeature);
	layerControl.removeLayer(other);
	layerControl.removeLayer(outdoor);
	layerControl.removeLayer(professionalAndPublic);
	layerControl.removeLayer(shoppingAndService);

	layerControl.addOverlay(selectAll, '<span class="italic">Un/check all</span>');
	layerControl.addOverlay(transportation, "Transportation (" + num1 + ")");
	layerControl.addOverlay(foodAndDrink, "Food and Drink (" + num2 + ")");
	layerControl.addOverlay(carService, "Car Service (" + num3 + ")");
	layerControl.addOverlay(cultureAndEntertainment, "Culture and Entertainment (" + num4 + ")");
	layerControl.addOverlay(lodging, "Lodging (" + num5 + ")");
	layerControl.addOverlay(naturalFeature, "Natural Feature (" + num6 + ")");
	layerControl.addOverlay(other, "Other (" + num7 + ")");
	layerControl.addOverlay(outdoor, "Outdoor (" + num8 + ")");
	layerControl.addOverlay(professionalAndPublic, "Professional and Public (" + num9 + ")");
	layerControl.addOverlay(shoppingAndService, "Shopping and Service (" + num10 + ")");

	mymap.addLayer(selectAll);
	mymap.addLayer(transportation);
	mymap.addLayer(foodAndDrink);
	mymap.addLayer(carService);
	mymap.addLayer(cultureAndEntertainment);
	mymap.addLayer(lodging);
	mymap.addLayer(naturalFeature);
	mymap.addLayer(other);
	mymap.addLayer(outdoor);
	mymap.addLayer(professionalAndPublic);
	mymap.addLayer(shoppingAndService);

	mymap.panTo([center[0], center[1]]);
}
