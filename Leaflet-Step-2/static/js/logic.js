// Creating map object
var myMap = L.map("mapid", {
    center: [36.1699, -115.1398],
    zoom: 3.5
});

// Adding tile layer
var satelite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
}).addTo(myMap);

// Dark Layer
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});
// Outdoor Layer
var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

var baseMaps = {
    "Satelite": satelite,
    "Dark": dark,
    "Outdoor": outdoor
};

L.control.layers(baseMaps).addTo(myMap)

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson?"

tectonic_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


d3.json(tectonic_url, function(response){
    // Set Style
    var myStyle = {"color": "yellow"}
    // Plot Boundaries
    L.geoJSON(response, {
        style: myStyle
    }).addTo(myMap);
});

d3.json(url, function(data) {
    var myarray = []

    data.features.forEach(function(response){
        var coordinates = [response.geometry.coordinates[1], response.geometry.coordinates[0]]

        var marker = L.circle(coordinates, {
            color: 'black',
            fillColor: depthColor(response.geometry.coordinates[2]),
            fillOpacity: 0.75,
            radius: magRadius(response.properties.mag),
            weight: 1
        }).bindPopup(`Place: ${response.properties.place} <br>
                    Depth: ${response.geometry.coordinates[2]} <br>
                    Magnitude: ${response.properties.mag} <br>
                    (Lat, Lon): (${coordinates[0]}, ${coordinates[1]})`)

        myarray.push(marker);
        marker.addTo(myMap);
    })

    L.control.layers(overlapMays).addTo(myMap)
    // Position Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<h4>Depth Legend</h4>";
        div.innerHTML += '<i style="background: #A3F600"></i><span>-10 to 10</span><br>';
        div.innerHTML += '<i style="background: #DCF400"></i><span>10 to 30</span><br>';
        div.innerHTML += '<i style="background: #F7DB11"></i><span>30 to 50</span><br>';
        div.innerHTML += '<i style="background: #FDB72A"></i><span>50 to 70</span><br>';
        div.innerHTML += '<i style="background: #FCA35D"></i><span>70 to 90</span><br>';
        div.innerHTML += '<i style="background: #FF5F65"></i><span>90 +</span><br>';        
        
        return div;
      };
      
      legend.addTo(myMap);
});

// Define function to determine color according to depth
function depthColor(depth){
    if (depth <=10){
        return '#A3F600';
    }
    else if (depth > 10 && depth <= 30){
        return '#DCF400';
    }
    else if (depth > 30 && depth <= 50){
        return '#F7DB11';
    }
    else if (depth > 50 && depth <= 70){
        return '#FDB72A';
    }
    else if (depth > 70 && depth <= 90){
        return '#FCA35D';
    }
    else{
        return '#FF5F65';
    }

}

// Define function to determin radius according to magnitude
function magRadius(mag){
    return mag*30000
}
