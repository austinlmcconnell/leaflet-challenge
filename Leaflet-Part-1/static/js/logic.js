// Store API link in variable
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Perform a GET request
d3.json(queryUrl).then(function (data) {
    console.log(data);

// Send the data.features object to the createFeatures function.
     createFeatures(data.features);
   });

// Marker size 
function markerSize(magnitude) {
    return magnitude * 1000;
  };

// Determine color of marker based on depth
function chooseColor(depth) {
    if (depth > 100) return "green";
    else if (depth > 75) return "yellow";
    else if (depth > 50) return "gold";
    else if (depth > 25) return "orange";
    else return "red";
    };

// Define function to run for each feature and create popups detailing place and time of earthquake
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
      }};

// Create map
function createMap(earthquakes) {

    let myMap = L.map("map", {
        center: [
          37, -95
        ],
        zoom: 5,
      });

// Create tile layer and add to map
    let grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);   

// Create GeoJSON layer, run onEachFeature function for each data point and add to map   
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    }).addTo(myMap);
};

// Create legend

let legend = L.control({position: "bottomleft"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    let limits = geojson.options.limits;
    let colors = ["red", "orange", "gold", "yellow", "green"];
    let labels = [];
 
// Add the minimum and maximum

    let legendInfo = "<h1>Earthquake Depth</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.depth + 25] + "</div>" +
    "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

// Add legend to the map
  legend.addTo(myMap);