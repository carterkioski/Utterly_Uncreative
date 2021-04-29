//"map" is name of div in index.html for the map
var myMap = L.map("map", {
    center: [38.9, -97],
    zoom: 5
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);



function updateMap() {
    //Set this whole block to be onchange of html carasoulr selector div
    // Store API query variables
    var baseURL = "whatever path to api";
    //TODO: GET THIS FROM HTML input
    var wineType = "Merlot"


    d3.json(url).then(function(response) {

    // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through data
    for (var i = 0; i < response.length; i++) {

        // Set the data location property to a variable
        //currenlty just doing name since location not up yet
        /*will be something like 
        var lng = response[i].long;
        var lat = response[i].lat;
        if (lng && lat) {

        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([lng, lat])
            .bindPopup(response[i].wineryname));
        }

        
        */


        // Check for location property
        if (location) {

        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
            .bindPopup(response[i].descriptor));
        }

    }

    // Add our marker cluster layer to the map
    myMap.addLayer(markers);

    });
}
//select the carasoule, on change run updateMap
d3.select("#selDataset").on("change", updateMap);