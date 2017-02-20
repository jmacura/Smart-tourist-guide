/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @author jmacura 2016-2017
// @author jachymkellar 2017

// global variables
var no; //number of searches made during one session
var destination = null;
var cats = false;

//defining Event Handlers
$(document).ready(function(e) {
	no = 0; //reset the number when the page reloads
	document.getElementById('search-by-name').addEventListener('submit', searchPlaceGeoNames);
	document.getElementById('search-by-latlon').addEventListener('submit', searchLocationHeader);
	document.getElementById('search-by-position').addEventListener('submit', searchAround);
	//console.log("loaded");
});


function searchAround(e) {
	e.preventDefault();
	var r = this.r.value;
	if (r > 5 || r <= 0) {
		printError('Radius has to be positive number smaller than 5');
		return;
	}
	runProgressbar('resultsLoader');
	if(!navigator.geolocation) {
		console.log("not possible in your browser");
		killProgressbar('resultsLoader');
		return;
	}
	navigator.geolocation.getCurrentPosition(function(position) {
		//console.log(position)
		searchLocation([position.coords.latitude, position.coords.longitude, r]);
		}, function(error) {
		killProgressbar('resultsLoader');
		switch(error.code) {
			case error.PERMISSION_DENIED:
				printError("User denied the request for Geolocation."); break;
			case error.POSITION_UNAVAILABLE:
				printError("Location information is unavailable."); break;
			case error.TIMEOUT:
				printError("The request to get user location timed out."); break;
			case error.UNKNOWN_ERROR:
				printError("An unknown error occurred."); break;
		}
		}, {enableHighAccuracy: false, timeout: 1000, maximumAge: 0}
	); //10 000 ms timeout
}

function searchPlaceGeoNames(e) {
	e.preventDefault();
	var place = this.place.value;
	if(place.length <= 1) {
		printError("Please, provide at least 2 characters");
		return;
	}
	//console.log("shit", e.type);
	runProgressbar('digestLoader');
	//console.log(this.place.value);
	var url = 'http://api.geonames.org/searchJSON';
	var queryUrl = url+'?q='+encodeURIComponent(place)+'&fuzzy=0.8&isNameRequired=true&username=spoi&callback=?';
	$.ajax({
		dataType: 'json',
		url: queryUrl,
		error: function(jqXHR, status, err) {
			console.log(status + err);
		},
		success: function(data) {
			console.log(data);
			digest(place, data.geonames);
			killProgressbar('digestLoader');
		}
	});
}

function digest(input, points) {
	var d, r, a;
	var nfo = document.createElement('DIV');
	var p = document.createElement('P');
	p.appendChild(document.createTextNode("Choose from places found:"));
	nfo.appendChild(p);
	var t = document.createElement('TABLE');
	for(var i = 0; i < points.length; i++) {
		r = document.createElement('TR');
		d = document.createElement('TD');
		a = document.createElement('A');
        a.setAttribute("onclick", 'moveToMap()');
		a.data = points[i]; //used in searchPlaceSPOI()
		a.addEventListener('click', searchPlaceSPOI);
		a.setAttribute("href", '#');
		a.appendChild(document.createTextNode(points[i].name));
		d.appendChild(a);
		r.appendChild(d);
		d = document.createElement('TD');
		d.appendChild(document.createTextNode(points[i].fclName + " in " + points[i].countryName));
		r.appendChild(d);
		t.appendChild(r);
	}
	nfo.appendChild(t);
	//nfo.setAttribute("class", 'digest');
	var infoBlock = document.getElementById('digest-block');
	infoBlock.removeChild(infoBlock.firstChild);
	infoBlock.appendChild(nfo);
}

/**
 * handles GeoNames result to search in SPOI
 */
function searchPlaceSPOI(e) {
	console.log(e);
	place = e.target.data;
	runProgressbar('resultsLoader');
	searchLocation([place.lat, place.lng, 3]);
/**
	* currently unused part
	* performs hard regexp matching against SPOI endpoint
	*/
/*var url = 'http://data.plan4all.eu/sparql';
	var query = 'SELECT DISTINCT ?linkThing ?name ?wkt \n' +
		'WHERE {\n' +
		' ?linkThing rdfs:label ?name.\n' +
		' FILTER regex(?name, "' + place + '", "i").\n' +
		' ?linkThing ogcgs:asWKT ?wkt\n' +
		'}';
		console.log(query);
	var queryUrl = url+'?query='+encodeURIComponent(query)+'&format=json&callback=?';
	$.ajax({
		dataType: 'json',
		url: queryUrl,
		success: function(data) {
			var POIs = data.results.bindings;
			console.log(data);
			showInfo([place], data.head.vars, POIs);
			killProgressbar("resultsLoader");
		}
	});*/
}

function searchLocationHeader(e) {
	e.preventDefault();
	if (this.r.value > 5 || this.r.value <= 0) {
		printError("Radius has to be positive number smaller than 5");
		return;
	}
	runProgressbar('resultsLoader');
	searchLocation([this.lat.value, this.lon.value, this.r.value]);
	this.reset();
}

function searchLocation(input) {
	//e.preventDefault();
	//runProgressbar("resultsLoader");
	//console.log(input);
	//var input = [this.lat.value, this.lon.value, this.r.value]; //[latitude, longitude, radius]
	var url = 'http://data.plan4all.eu/sparql';
	var query = "PREFIX poi: <http://www.openvoc.eu/poi#>\n" +
		"SELECT ?linkThing ?name ?sg AS ?wkt ?category WHERE {\n" +
		"?linkThing ogcgs:asWKT ?sg;\n" +
		" rdfs:label ?name.\n" +
		" FILTER(bif:st_intersects (?sg, bif:st_point (" + input[1] + ", " + input[0] + "), " + input[2] + ")).\n" +
		" OPTIONAL {?linkThing poi:class ?category .}\n" +
		"}";
	console.log(query);
	var queryUrl = url+'?query='+encodeURIComponent(query)+'&format=json&callback=?';
	$.ajax({
		dataType: 'json',
		url: queryUrl,
		error: function(jqXHR, status, err) {
			console.log(status + err);
		},
		success: function(data) {
			//console.log(data);
			var POIs = preprocess(data.results.bindings);
			mymap.setView([input[0], input[1]], 13);
			showInfo(input, data.head.vars, POIs);
			killProgressbar("resultsLoader");
		}
	});
	//this.reset();
}

// **** Get the list of Categories (Classes) from SPOI ****
function getCats() {
	if(cats) {return;};
	cats = true;
	document.getElementById("catFilter").style.display = 'block';
	runProgressbar('catProgress');
	var url = 'http://data.plan4all.eu/sparql';
	var query = "PREFIX poi: <http://www.openvoc.eu/poi#>\n" +
	"SELECT DISTINCT ?Concept WHERE {?obj poi:class ?Concept}";
	console.log(query);
	var queryUrl = url+'?query='+encodeURIComponent(query)+'&format=json&callback=?';
	$.ajax({
		dataType: 'json',
		url: queryUrl,
		error: function(jqXHR, status, err) {
			console.log(status + err);
		},
		success: function(data) {
			var catz = data.results.bindings;
			killProgressbar('catProgress');
			var catFilter = document.getElementById("catFilter");
			var ls = document.createElement("UL");
			for(var i = 0; i < catz.length; i++) {
				var cat = catz[i].Concept.value.slice(32);
				//console.log(cat);
				var li = document.createElement("INPUT");
				li.setAttribute("type", 'checkbox');
				li.setAttribute("value", cat);
				li.setAttributeNode(document.createAttribute("checked"));
				li.addEventListener('change', filter);
				ls.appendChild(li);
				ls.appendChild(document.createTextNode(cat));
				ls.appendChild(document.createElement("BR"));
			}
			catFilter.appendChild(ls);
			//showInfo(input, data.head.vars, POIs);
			//killProgressbar("resultsLoader");
		}
	});
}

// **** Background support for displaying info ****
function showInfo(input, headers, points) { //points is the array of data
	var heads = thingsAndLinks(headers);
	console.log(headers);
	console.log(heads);
	console.log(points);
	var infoBlock = document.getElementById("info-block");
	var nfo, ls, r, d, l, t, p;

	//print heading
	nfo = document.createElement("H2");
	var info = 'Results for ';
	for(var i = 0; i < input.length; i++) {
		if(i > 0) {info += " "};
		info += input[i];
	}
	t = document.createTextNode(info + ':');
	nfo.appendChild(t);

	
	var charts = document.createElement("DIV");
	charts.setAttribute("id", 'charts');

	//create map
	/*
	var mappa = document.createElement("DIV");
	mappa.setAttribute("id", 'map');
	charts.appendChild(mappa);
	if (input[1]) {
		var map = L.map(mappa).setView([input[0], input[1]], 11);
	}
	else {
		var map = L.map(mappa).setView([0, 0], 1);
	}
	L.tileLayer('http://{s}.tiles.mapbox.com/v3/yjm.j5j87g72/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);
*/

	//create block for weather forecast
	var forecast = document.createElement("DIV");
	forecast.setAttribute("id", 'forecast');
	charts.appendChild(forecast);
	phpUrl = './getWeather.php?lat=' + input[0] + '&lon=' + input[1];
	//phpUrl = 'predpoved2.xml'; //ONLY FOR LOCAL TESTINGS
	$.ajax({
		dataType: 'xml',
		url: phpUrl,
		error: function(jqXHR, status, err) { //if weather API does not work
			var p = document.createElement("P");
			p.appendChild(document.createTextNode('Error obtaining weather forecast: ' + status));
			forecast.appendChild(p);
		},
		success: function(data) {
			var obj = xmlToJson(data.firstChild);
			//console.log(obj);
			var weather = parseWeather(obj); //<- implement var [[day, time, symb, minT, maxT]] = parseWeather() ??
			//console.log(weather);
			var h = document.createElement("H3");
			h.appendChild(document.createTextNode('Weather forecast in the location for the upcoming 48 hours'));
			forecast.appendChild(h);
			r = document.createElement("TR");
			for(var i = 0; i < weather.length; i++) {
				d = document.createElement("TD");
				p = document.createElement("P");
				p.appendChild(document.createTextNode(weather[i][0].slice(3,5) == new Date().getDate() ? 'today' : weather[i][0])) //den
				d.appendChild(p);
				p = document.createElement("P");
				var printtime = weather[i][1] + '–' + (weather[i][1]+6); //forecasted time interval
				p.appendChild(document.createTextNode(printtime));
				d.appendChild(p);
				var img = document.createElement("IMG"); //image of weather condition
				var night = ((weather[i][1] == 18 || weather[i][1] == 0) ? true : false);
				var imgSrc = 'http://api.met.no/weatherapi/weathericon/1.1/?symbol=' + weather[i][2] + ';' + (night ? 'is_night=1;' : '') + 'content_type=image/svg%2Bxml';
				img.setAttribute("src", imgSrc);
				d.append(img);
				var maxT = 'max: ' + weather[i][4] + ' °C';
				p = document.createElement("P");
				p.setAttribute("class",'tmax');
				p.appendChild(document.createTextNode(maxT)); //max temperature in interval
				d.appendChild(p);
				var minT = 'min: ' + weather[i][3] + ' °C';
				p = document.createElement("P");
				p.setAttribute("class",'tmin');
				p.appendChild(document.createTextNode(minT)); //min temperature in interval
				d.appendChild(p);
				r.appendChild(d);
			}
			var tab = document.createElement("TABLE");
			tab.appendChild(r);
			forecast.appendChild(tab);
			p = document.createElement("P");
			p.setAttribute("class", 'weather-info');
			p.appendChild(document.createTextNode('Weather forecast from Yr, delivered by the Norwegian Meteorological Institute and NRK'));
			forecast.appendChild(p);
		}
	});

//Category filtering
	var catFilter = document.createElement("DIV");
	catFilter.setAttribute("id", 'catFilter');
	var catProg = document.createElement("DIV");
	catProg.setAttribute("class", 'progressbar');
	catProg.setAttribute("id", 'catProgress');
	catFilter.appendChild(catProg);
	//catFilter.addEventListener('mouseover', getCats);

	ls = document.createElement("TABLE");
	ls.setAttribute("class", 'table-results');
	//set headers
	r = document.createElement("TR");
	for(var i = 0; i < heads[1].length; i++) {
		d = document.createElement("TH");
		d.setAttribute("class", 'results-heading');
		t = document.createTextNode(heads[1][i]);
		d.appendChild(t);
		if(heads[1][i] == "category") {
			var aCat = document.createElement("A");
			aCat.setAttribute("href", '#');
			aCat.appendChild(document.createTextNode(' (Filter)'));
			aCat.addEventListener('click', getCats);
			d.appendChild(aCat);
		}
		r.appendChild(d);
	}
	ls.appendChild(r);


	//print POIs
	//var color = 'rgb('+ Math.floor((Math.random() * 250) + 1)+', ' + Math.floor((Math.random() * 250) + 1) + ', 61)';
    var color = ['', blueIcon, greenIcon, redIcon, purpleIcon, yellowIcon, orangeIcon, greyIcon, azureIcon, ochreIcon, pinkIcon, blackIcon];
    var color2 = 'rgb('+ Math.floor((Math.random() * 250) + 1)+', ' + Math.floor((Math.random() * 250) + 1) + ', 61)';
	var mypoints = new L.LayerGroup();
    var markersCluster = L.markerClusterGroup();
	for(var i in points) {
		if (!points.hasOwnProperty(i)) {
			continue; //the current property is not a direct property of p
		}
		var objName = points[i]['linkThing'].value.split('#')[1];
		var objName2 = points[i]['name'].value;
		objName2 = objName2.replace(/_/g, " ");
		var objCategory = points[i]['category'].value.substring(32).replace(/_/g, " ");
		r = document.createElement("TR");
		var latlng = points[i]['wkt'].value.split(" ");  //get lat and long from WKT
		//console.log(latlng);
        if(no < 12){
            var m = L.marker([latlng[1].slice(0,-1), latlng[0].slice(6)], {icon: color[no]});
        }
        else{
            var m = L.circleMarker([latlng[1].slice(0,-1), latlng[0].slice(6)], {radius: 7, color: color2});
        }
		m.bindPopup("<div class=popup-title>"+objName2+"</div><div class=popup-info>"+Math.round((latlng[1].slice(0,-1))*1000)/1000+" "+Math.round((latlng[0].slice(6))*1000)/1000+"</div><div class=popup-info>"+objCategory+"</div><div class=popup-link><a href=#"+objName+">Navigate to<a/></div>");
		m.name = objName;
		//m.on('click', navigateTo);
		//m.addTo(mypoints);
        markersCluster.addLayer(m);

		//console.log(lat, lng);
		for(var j = 0; j < heads[1].length; j++) {
			d = document.createElement("TD");
			var a = document.createElement("A");
			a.setAttribute("name", objName);
			d.appendChild(a);
			//console.log(j, heads[1][j]);
			var txt = '';
			//console.log(points[i][heads[1][j]]);
			if(points[i][heads[1][j]].list) {
			//If there is more then 1 category, then they are in the list attribute
				for(var k = 0; k < points[i][heads[1][j]].list.length; k++) {
					if(txt.length > 1) {
						txt += ', ';
					}
					appendAttribute(r, "class", points[i][heads[1][j]].list[k].slice(32));
					txt += points[i][heads[1][j]].list[k].slice(32).replace(/_/g, ' ');
				}
			} else if (points[i][heads[1][j]].value.includes('#')) { //If the line contains # sign => it is a single category
				appendAttribute(r, "class", points[i][heads[1][j]].value.slice(32)); // if there is a category for given point => save it to the class attribute of corresponding row
				txt = points[i][heads[1][j]].value.slice(32).replace(/_/g, ' '); //Prettyprint categories
			}
			else {
				txt = points[i][heads[1][j]].value; // If the object has no name => print ---
			}
			t = document.createTextNode( (points[i][heads[1][j]]) ? txt : '---');
			if(heads[0][j]) {
				l = document.createElement("A");
				l.setAttribute("href", points[i][heads[0][j]].value);
				l.setAttribute("target", '_blank');
				l.appendChild(t); d.appendChild(l);
			}
			else {
				d.appendChild(t);
			}
			r.appendChild(d);
		}
		//d = document.createElement("TD");
		//t = document.createTextNode(points[0].s.value);
		//d.appendChild(t);
		//r.appendChild(d);
		ls.appendChild(r);
	}

	//mymap.addLayer(mypoints);
	//layerControl.addOverlay(mypoints, "My Points "+no);
    mymap.addLayer(markersCluster);
	layerControl.addOverlay(markersCluster, "My Points "+no);

  	//Footer section with export button
	var foot = document.createElement("DIV");
	foot.setAttribute("class", 'to-top');
	var e = document.createElement("a");
	e.setAttribute("href", '#');
	e.setAttribute("onclick", 'moveToMap()');
	foot.appendChild(e);
	var k = document.createElement("span");
	k.setAttribute("class",'glyphicon glyphicon-chevron-up');
	e.appendChild(k);

	var exporter = document.createElement("FORM");
	exporter.setAttribute("class", 'exporter');
	exporter.setAttribute("id", 'result_'.concat(no));
	var exBtn = document.createElement("BUTTON");
	exBtn.setAttribute("class", 'btn btn-default');
	exBtn.appendChild(document.createTextNode("EXPORT POINTS"));
	exBtn.addEventListener('click', exportHandler);
	var gjsOption = document.createElement("INPUT");
	gjsOption.setAttribute("type", 'radio');
	gjsOption.setAttribute("name", 'type');
	gjsOption.setAttribute("value", 'geojson');
	var kmlOption = document.createElement("INPUT");
	kmlOption.setAttribute("type", 'radio');
	kmlOption.setAttribute("name", 'type');
	kmlOption.setAttribute("value", 'kml');
	kmlOption.setAttribute("checked", '');
	var sendBtn = document.createElement("INPUT");
	sendBtn.setAttribute("type", 'submit');
	sendBtn.setAttribute("class", 'btn btn-default');
	sendBtn.setAttribute("value", 'SAVE');
	exporter.appendChild(exBtn);
	exporter.appendChild(document.createElement("BR"));
	exporter.appendChild(gjsOption);
	var span = document.createElement("SPAN");
	span.appendChild(document.createTextNode("GeoJSON"));
	exporter.appendChild(span);
	exporter.appendChild(kmlOption);
	var span = document.createElement("SPAN");
	span.appendChild(document.createTextNode("KML"));
	exporter.appendChild(span);
	exporter.appendChild(document.createElement("BR"));
	exporter.appendChild(sendBtn);
	exporter.addEventListener('submit', saveData);
	//foot.insertBefore(document.createElement("BR"), foot.firstChild);
	foot.insertBefore(exporter, foot.firstChild);

	//remove existing information
	/*while(infoBlock.hasChildNodes()) {
		infoBlock.removeChild(infoBlock.firstChild);
	}*/
	//append new information

	infoBlock.insertBefore(foot, infoBlock.firstChild);
	infoBlock.insertBefore(ls, infoBlock.firstChild);
	infoBlock.insertBefore(catFilter, infoBlock.firstChild);
	infoBlock.insertBefore(charts, infoBlock.firstChild);
	infoBlock.insertBefore(nfo, infoBlock.firstChild);
}

//Handle duplicates
function preprocess(arr) {
	var obj = {};
	var geojs = [];
	var k = 0;
	for(var i = 0; i <arr.length; i++) {
		if(obj[arr[i].linkThing.value]) { //if the object already exist..
			obj[arr[i].linkThing.value].category.list = [obj[arr[i].linkThing.value].category.value, arr[i].category.value]; //..then only create array of categories
			//console.log(obj[arr[i].linkThing.value].category.list);
		}
		else {
			obj[arr[i].linkThing.value] = arr[i]; //the simple way for generic JSON object
		}
	}
	var k = 0;
	for(var i in obj) {
	var props = {};
		for(var j in obj[i]) {
			if(!obj[i].hasOwnProperty(j) || (obj[i][j] && obj[i][j].datatype == 'http://www.openlinksw.com/schemas/virtrdf#Geometry')) { //skip subproperties & geometry type
				continue;
			}
			props[j] = obj[i][j];
			//console.log(props);
		}
		geojs[k++] = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [Number(obj[i].wkt.value.split(" ")[0].slice(6)), Number(obj[i].wkt.value.split(" ")[1].slice(0,-1))]}, 'properties' : props};
	}
	//console.log(geojs);
	geojs = {"type": "FeatureCollection", "features": geojs};
	if (typeof(Storage) !== "undefined") { // If Browser supports the localStorage/sessionStorage
		sessionStorage.setItem('result_'.concat(++no), JSON.stringify(geojs));
	} else { //No Web Storage support
		printError('Your browser does not support Web Storage API. Export of data will not be available!');
	}
	return obj;
}

function exportHandler(e) {
	e.preventDefault();
	var objs = e.target.parentNode.childNodes;
	for(var i = 0; i < objs.length; i++) {
		objs[i].style.display = 'inline-block';
	}
	e.target.style.display = 'none';
}

function saveData(e) {
	e.preventDefault();
	var objs = this.childNodes;
	for(var i = 0; i < objs.length; i++) {
		objs[i].style.display = 'none';
	}
	this.getElementsByTagName("BUTTON")[0].style.display = 'inline-block';
	var resultset = this.id;
	if(this.type.value == 'geojson') {
		dataBlob = new Blob([sessionStorage.getItem(resultset)], {type: "application/sgeo+json;charset=utf-8"})
		saveAs(dataBlob, 'points_' + resultset + '.geojson');
	} else if(this.type.value == 'kml') {
		var kml = tokml(JSON.parse(sessionStorage.getItem(resultset)), {documentName: 'Points of interest', documentDescription: 'Generated by Smart Tourist Guide', name: 'name.value'});
		dataBlob = new Blob([kml], {type: "application/vnd.google-earth.kml+xml;charset=utf-8"})
		saveAs(dataBlob, 'points_' + resultset + '.kml');
	} else {
		printError('Error exporting the data');
	}
}

//distinct things and their links <-- too complex, too generic, needs refactoring
function thingsAndLinks(arr) {
	if(! (arr instanceof Array)) {console.log("no way!"); return;}
	var newA = [[0],[0]];
	var j = 0;
	for(var i = 0; i < arr.length; i++) {
	//console.log(arr[i].substring(0,4));
		if(arr[i].substring(0,4) == 'link') {
			newA[0][j] = arr[i];
		}
		else if(arr[i].substring(0,3) == 'wkt') {
		}
		else {
			newA[1][j++] = arr[i];
		}
	}
	//console.log(newA);
	return newA;
}

function runProgressbar(name) {
	$( "#" + name ).progressbar({
		value: false
	});
}

function killProgressbar(name) {
	$( "#" + name ).progressbar( "destroy" );
}

function parseWeather(obj) {
	var pointData = obj.product.time;
	var weatherArr = []; //each row has [date of origin time, origin time, symbol, minT, maxT]
	var j = 0;
	for(var i = 0; i < pointData.length && j < 8; i++) {
		var t = pointData[i].location;
		var d = pointData[i]['@attributes'].from.slice(5,10);
		var fromH = Number(pointData[i]['@attributes'].from.slice(11,13));
		var toH = Number(pointData[i]['@attributes'].to.slice(11,13));
		if(t.symbol && (toH % 6 == 0) && ((toH == 00 ? 24 : toH)-fromH == 6)) {
			weatherArr[j++] = [d, fromH, t.symbol['@attributes'].number, t.minTemperature['@attributes'].value, t.maxTemperature['@attributes'].value]; //array of length 8 ???
			//console.log(weatherArr[j-1]);
		}
	}
	//console.log(weatherArr.length);
	return weatherArr;
}

function navigateTo(e) {
	var name = e.target.name;
	document.location = '#' + name;
	var ele = document.getElementsByName(name)[0];
	ele.parentNode.parentNode.style.background = '#ddffdd';
}

/**
 * Filters categories the user is not interested in and hide them
 */
function filter(e) {
	var cat = e.target.value;
	console.log(cat);
	var lines = document.getElementsByClassName(cat);
	if(lines[0] && lines[0].style.display != 'none') {
		for(var i = 0; i < lines.length; i++) {
			lines[i].style.display = 'none';
		}
	}
	else {
		for(var i = 0; i < lines.length; i++) {
			lines[i].style.display = 'table-row';
		}
	}
}

/**
 * Extends the implicit setAttribute() fction with ability to just append the new value if the attribute already exists
 **/
function appendAttribute(elem, attr, newValue) {
	if(elem.hasAttributes()) {
		elem.setAttribute(attr, elem.getAttribute(attr) + ' ' + newValue);
	}
	else {
		elem.setAttribute(attr, newValue);
	}
}

/**
 *@author David Walsh
 **/
function xmlToJson(xml) {
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function printError(text) {
	var nfo = document.createElement("DIV");
	nfo.appendChild(document.createTextNode(text));
	nfo.setAttribute("class", 'err');
	var infoBlock = document.getElementById("info-block");
	infoBlock.insertBefore(nfo, infoBlock.firstChild);
}

function animateBox(obj) {
	obj.childNodes[5].style.display = 'inline-block';
	if(obj.childNodes[10]) { //if there is elem[10] = digest of results, there is also elem[8] = progressbar for digest
		obj.childNodes[8].style.display = 'inline-block';
		obj.childNodes[10].style.display = 'inline-block';
	}
	obj.childNodes[1].style.display = 'none';
	//console.log(obj.childNodes);
	var forms = document.getElementsByTagName("FORM");
	for(var i = 0; i < 3; i++) {
		if(forms[i].id != obj.childNodes[5].id) {
			forms[i].style.display = 'none';
			//console.log(forms[i].parentNode.childNodes[1]);
			forms[i].parentNode.childNodes[1].style.display = 'inline-block';
			if(forms[i].parentNode.childNodes[10]) {
				forms[i].parentNode.childNodes[8].style.display = 'none';
				forms[i].parentNode.childNodes[10].style.display = 'none';
			}
		}
	}
}

function moveToMap(){
	$('html, body').animate({
		scrollTop: $("#scroll-to").offset().top
	}, 1000);
}
