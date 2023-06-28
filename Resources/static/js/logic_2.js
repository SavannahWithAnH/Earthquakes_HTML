// logic_1 creates first tile layer, a layerGroup for the earthquakes and a layer control

// base layers
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// layerGroup
let earthquakes = new L.layerGroup();

// overlayMap
let overlayMaps = {
    Earthquakes: earthquakes
};

// map creation
let Smap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
});

// control layer
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(Smap);

// logic_2 retrieves usgs earthquake data and creates circleMarker, with popups


// earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// d3
d3.json(queryUrl).then(function (data) {

    console.log(data);

    // geojson layer from leafletjs documentation
    var geojsonMarkerOptions = {
        radius: 7,
        fillColor: "#6a5acd",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
    };

    L.geoJSON(data, { 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        //popup with details via leaflet documentation
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(`
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>${new Date(feature.properties.time)}</p>   
            <h3>Magnitude: ${feature.properties.mag}</h3>
            <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`);
            }
    }).addTo(earthquakes);

});