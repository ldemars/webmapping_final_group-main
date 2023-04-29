var map;
var filePath = ["data/tracts_rank.geojson", 
                "data/subway_lines.geojson", 
                "data/subway_stations.geojson"];
//function to instantiate the Leaflet map
function createMap(){
    
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 1
    });
    
    //add OSM base tilelayer
    var baseLayer = {"Open Street Map": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    })};

    baseLayer["Open Street Map"].addTo(map);

    var overlays 
    var layerControl = L.control.layers(baseLayer, overlays).addTo(map);

    //call getData function
    tractData(filePath[0],layerControl);
    //lineData(filePath[1]);
    //stationData(filePath[2]);
};

function tractData(input,layerControl){
    var tracts; 
    
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            
            L.geoJson(json).addTo(map);
            //tracts = {"Tracts": response}; 
            
            var tracts = L.geoJson(json);
            console.log(tracts);
            layerControl.addOverlay(tracts,"Tracts");
            
            //calcStats();
            //createChoropleth();
            //createSequenceControls();
            //createLegend();

            //check that data loaded properly
            //console.log(tracts);
            
        })
    
    //console.log(tracts);
}



document.addEventListener('DOMContentLoaded',createMap)