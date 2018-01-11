/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator() {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function (onsuccess, onerror) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onsuccess, function (error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function (position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function (position) {
        return position.coords.longitude;
    };


    // Hier Google Maps API Key eintragen
    var apiKey = "YOUR API KEY HERE";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function (lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 10;

        if (apiKey === "YOUR API KEY HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "";
        if (typeof tags !== 'undefined') tags.forEach(function (tag) {
            tagList += "&markers=%7Clabel:" + tag.name
                + "%7C" + tag.latitude + "," + tag.longitude;
        });

        var urlString = "http://maps.googleapis.com/maps/api/staticmap?center="
            + lat + "," + lon + "&markers=%7Clabel:you%7C" + lat + "," + lon
            + tagList + "&zoom=" + zoom + "&size=640x480&sensor=false&key=" + apiKey;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };

    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

        updateLocation: function () {
          var long = document.getElementById('input_long');
          var lat = document.getElementById('input_lat');
          if(long.value === '' || lat.value === ''){
            tryLocate(function (position) {
              long.value = getLongitude(position) ;
              lat.value = getLatitude(position) ;
            }, function (error) {
                alert(error);
            });
          } else {
            console.log('Koordinaten sind schon gesetzt!')
          }

            // TODO Hier Inhalt der Funktion "update" ergänzen
        }

    }; // ... Ende öffentlicher Teil
})();

/**
 * $(document).ready wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(document).ready(function () {

    gtaLocator.updateLocation();
    // TODO Hier den Aufruf für updateLocation einfügen

    $('#eingabebutton').click(function(){
      var long = document.getElementById('input_long').value;
      var lat = document.getElementById('input_lat').value;
      var name = document.getElementById('input_name').value;
      var hashtag = document.getElementById('input_hashtag').value;
      var request=new XMLHttpRequest();
      request.open("post","http://localhost:3000/geotags");
      request.setRequestHeader("Content-type","application/json");
      var parsed = JSON.stringify({
        longitude:long,
        latitude:lat,
        name:name,
        hashtag:hashtag
      })
      request.send(parsed);
      setResults(request)
    })
    $('#applybutton').click(function(){
      var searchterm = document.getElementById('input_searchterm').value;
      var request=new XMLHttpRequest();
      request.open("get","http://localhost:3000/geotags?searchterm="+searchterm);
      request.send();
      setResults(request)
    })
});

function setResults (request){
    request.onreadystatechange = function(){
      if(request.readyState === 4){
        var results = JSON.parse(request.response)
        $('#results').empty();
        results.forEach(function(el){
          $('#results').append('<li>'+el.name+'('+ el.latitude+','+el.longitude+')'+el.hashtag+'</li>')
        })
      }
    }
}
