/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */

/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');

var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

//store data
let geotags = [];
// Setze ejs als View Engine
app.set('view engine', 'ejs');

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */
 app.use(express.static('public'));

// TODO: CODE ERGÄNZEN

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */

 // Konstruktor zum erstellen von GeoTags
 class GeoTag {
   constructor(latitude, longitude, name, hashtag) {
     this.latitude = latitude;
     this.longitude = longitude;
     this.name = name;
     this.hashtag = hashtag;
   }
 }

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

 var GeoTagModul = ( function() {
	 var isInRadius = function(lat1, long1, lat2, long2, radius) {
		return radius >= Math.sqrt( Math.pow(lat1 - lat2, 2)
								+ Math.pow(long1 - long2, 2)
								)
	 }

	 return {
		 //Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
		 searchRadius: function(latitude, longitude, radius) {
        console.log(geotags);
			geoTagResult = [];
			for(var i = 0; i < geotags.length; i++) {
				if( isInRadius(latitude, longitude, geotags[i].latitude, geotags[i].longitude, radius) ) {
					geoTagResult.push(geotags[i]);
           console.log("radius");
				}
			}
			return geoTagResult;
		 },

         //Funktion zur Suche von Geo Tags nach Suchbegriff Name.
		 searchName: function(latitude,longitude,name) {
       let searchResults = [];
       if(name !== undefined){
         let filteredgeotags=GeoTagModul.searchRadius(latitude, longitude, 0.1);
         filteredgeotags.forEach(function(el){
           if(el.name.indexOf(name) > -1){
             searchResults.push(el);
           }
         })
       }
       // Wenn der Name undefined ist sucht man nur nach Radius.
       else {
         searchResult=GeoTagModul.searchRadius(latitude, longitude, 0.1);
       }

       return searchResults;
     },

         //Funktion zum hinzufügen eines Geo Tags.
		 add: function(latitude, longitude, name, hashtag) {
       const newGeoTagObj=new GeoTag(latitude, longitude, name, hashtag);
			geotags.push(newGeoTagObj);
			return newGeoTagObj;
		 },

         //Funktion zum Löschen eines Geo Tags.
		 remove: function(index) {
			 if (index >= 0 && index < geotags.length) {
				geotags.splice(index, 1);   // 1 zum loeschen
			}
		 }
	 };
 })();

/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */
// Ist unsere Hauptseite. (gta.ejs) wird gerendert mit leeren Liste, Objekt, ...
app.get('/', function(req, res) {
    res.render('gta', {
        taglist: [],
        tagObj: {}
    });
});

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */
// Pfad zu /tagging. Aufruf nach click on Button Submit
app.post('/tagging', function(req, res) {
const tagObj=GeoTagModul.add(req.body.latitude, req.body.longitude, req.body.name, req.body.hashtag);
// Hier in render() wird Liste erstellt. (immer in render()).
  res.render('gta', {
      taglist: GeoTagModul.searchRadius(req.body.latitude, req.body.longitude, 0.1),
      tagObj: tagObj,
      hiddenlat:req.body.latitude,
      hiddenlong:req.body.longitude
  });
});

/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */

//Pfad zu /discovery nach click on button Apply
app.post('/discovery', function(req, res) {
  const body = req.body;
  const name = body.searchterm;
  // Suche nach Namen
  result=GeoTagModul.searchName(body.hiddenlatitude, body.hiddenlongitude,name);
// Schreiben unsere Long, Lat, ... rein damit Seite nicht neue laden muss.
let tagObj={};
tagObj.latitude=req.body.hiddenlatitude;
tagObj.longitude=req.body.hiddenlongitude;

  res.render('gta', {
      taglist: result,
      tagObj: tagObj,
      searchterm : name,
      hiddenlat:req.body.hiddenlatitude,
      hiddenlong:req.body.hiddenlongitude

  });
});
/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);
