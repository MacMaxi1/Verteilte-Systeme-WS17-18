# 2. Aufgabe - clientseitige Programmierung
In der zweiten Aufgabe soll die Position (d.h. die Koordinaten) des Browsers mit JavaScript abgefragt und in das Formular aus Aufgabe 1 eingetragen werden. Es wird dazu die **HTML5 GeoLocationAPI** verwendet. Optional kann mit der **Google Maps API** eine Karte angezeigt werden.

Die Aufgabe vertieft die Programmierung von **Modulen** und **Callbacks** sowie **DOM Manipulation** mit JavaScript.

## 2.1. Vorbereitung
Aktualisieren Sie zunächst das Github Repository [https://github.com/zirpins/vs1lab](https://github.com/zirpins/vs1lab). Dann gehen Sie wie folgt vor:

### 2.1.1 Vorherige Lösungen übernehmen und IDE vorbereiten
- Kopieren Sie die Datei `Aufgabe1/gta_v1/public/stylesheets/style.css` aus 
Aufgabe 1 nach `Aufgabe2/gta_v2/public/stylesheets/style.css`.
- Kopieren Sie die Datei `Aufgabe1/gta_v1/public/index.html` aus Aufgabe 1 nach `Aufgabe2/gta_v2/public/index.html` und öffnen Sie diese dann im **Editor**.
- Öffnen sie auch das Skript `Aufgabe2/gta_v2/public/javascripts/geotagging.js` in ihrem Editor.

### 2.1.2 Javascript im HTML aktivieren
- Fügen Sie als letzten Teil im Body des HTML Dokuments folgendes Fragment ein:

```
<!-- Load JavaScripts
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src="./javascripts/geotagging.js"></script>
```

### 2.1.3 Javascript testen
- Öffnen Sie die Datei `Aufgabe2/gta_v2/public/index.html` im **Browser**. Es sollte nun ein Alert Fenster erscheinen. Dadurch können Sie testen, dass das zugehörige Skript ausgeführt wird.

## 2.2. Teilaufgaben
### Koordinaten in das Formular eintragen
Das JavaScript enthält ein Modul `gtaLocator` mit Funktionen zur Abfrage der GeoLocationAPI und zur Verwendung der resultierenden `position`. Die Funktion `tryLocate` nimmt als Parameter zwei *Callback Funktionen* an, die bei Erfolg mit der Position oder bei Fehler mit einer Meldung 'zurückgerufen' werden. Beim Aufruf der Funktion müssen beide Callback Funktionen übergeben werden.

Fügen sie eine _öffentliche_ Funktion `updateLocation` zum Modul `gtaLocator` hinzu, die folgendes tut:

- Auslesen der Position mit `tryLocate`
- Im Erfolgsfall `latitude` und `longitude` Eingabefelder des Tagging-Formulars *und* des Discovery-Formulars (versteckte Eingabefelder) suchen und in deren `value`-Attribute Koordinaten schreiben.
- Im Fehlerfall ein `alert` öffnen und Fehlernachricht ausgeben.

Rufen sie die neue `updateLocation`-Funktion nach dem Laden des Dokuments automatisch auf.

### Zusatzaufgabe bei Interesse: Google Maps einbinden 
Um die Karte mit Google Maps zu aktualisieren, benötigen sie einen **API-Schlüssel** für die [Google Static Maps API](https://developers.google.com/maps/documentation/static-maps/) (kostenlos). Besorgen sie sich einen Key und tragen sie diesen im `gtaLocator` Modul im privaten Feld `apiKey` ein.

Ergänzen sie ihre `updateLocation`-Funktion im im `gtaLocator` Modul wie folgt:

- Rufen sie die Funktion `getLocationMapSrc` mit den aktuellen Koordinaten auf. Das Ergebnis ist eine **URL** auf die Karte.
- Suchen sie im DOM (bzw. mit jquery) das **Image Element** auf der Webseite.
- Ändern sie per DOM Aufruf (bzw. jquery) das `src`-Attribut auf die neue URL.
