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
app.use(bodyParser.json());
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
 class GeoTag {
   constructor(latitude, longitude, name, hashtag) {
     this.latitude = latitude;
     this.longitude = longitude;
     this.name = name;
     this.hashtag = hashtag;
   }
 }


// TODO: CODE ERGÄNZEN

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

// TODO: CODE ERGÄNZEN






/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function(req, res) {
    res.render('gta', {
        taglist: geotags,
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

// TODO: CODE ERGÄNZEN START



//hier code cooll
app.post('/tagging', function(req, res) {

  console.log(req.body);
  const body = req.body;
  const tagObj = new GeoTag(body.latitude, body.longitude, body.name, body.hashtag);
  geotags.push(tagObj);

  res.render('gta', {
      taglist: geotags,
      tagObj: tagObj
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

// TODO: CODE ERGÄNZEN
app.post('/discovery', function(req, res) {
  const body = req.body;
  const name = body.searchterm;
    let searchResults = [];
    if(name !== undefined){
      geotags.forEach(function(el){
        if(el.name.indexOf(name) > -1){
          searchResults.push(el);
        }
      })
    }


/*
  const lat = body.latitude;
  const long = body.longitude;
  GeoTagModul.searchName(lat,long,name);
*/

  //Ejs-Template wird mit GeoTag Objekten gerendert
  res.render('gta', {
      taglist: searchResults,
      tagObj: {},
      searchterm : name
  });
});
app.get('/geotags', function(req, res) {
  const name = req.query.searchterm;
  let searchResults = [];
  if(name !== undefined){
    geotags.forEach(function(el){
      if(el.name.indexOf(name) > -1){
        searchResults.push(el);
      }
    })
  }
  res.status(200).send(searchResults);
});
//Erstellung der GeoTag Objekte
app.post('/geotags', function(req, res) {
  const body = req.body;
  const tagObj = new GeoTag(body.latitude, body.longitude, body.name, body.hashtag);
  geotags.push(tagObj);
  res.status(201).send(geotags);
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
