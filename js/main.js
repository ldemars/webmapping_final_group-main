var map;
var filePath = ["data/tracts_rank.geojson", 
                "data/subway_lines.geojson", 
                "data/subway_stations.geojson"];

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [40.7, -74.006],
        zoom: 11,
        minZoom: 9,
        zoomControl: false //initialize without default zoom control to allow for placement options later
    });

    //Add zoom control with custom options
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    //Create OSM base tilelayer and save to variable
    var baseLayer = {"Open Street Map": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    })};

    //Add OSM base layer to map.
    baseLayer["Open Street Map"].addTo(map);

    //Create overlay control, initialized with baseLayer and no overlays. 
    var overlays 
    var layerControl = L.control.layers(baseLayer, overlays).addTo(map);

    

    //call getData functions
    tractData(filePath[0],layerControl,map);
    lineData(filePath[1],layerControl,map);
    stationData(filePath[2],layerControl,map);
};

function tractData(input,layerControl){
    
    var tractStyle = {
        fillColor: 'blue',//getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7}

    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){        
            var tracts = L.geoJson(json,{style: tractStyle});
            console.log(tracts);

            //calcStats();
            //createChoropleth();
            //createLegend();

            layerControl.addOverlay(tracts,"Tracts");
            //tracts.addTo(map);
            
        })
}

function lineData(input,layerControl){
    
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            var lines = L.geoJson(json);
            //createLineSymbols();
            //createLinePopups(); //Insert options into command below?
            lines.bindPopup("testing");

            console.log(lines);
            layerControl.addOverlay(lines,"Subway Lines");
            lines.addTo(map);
            //createLegend();  
        })
}

function stationData(input,layerControl,map){
    
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            var stations = L.geoJson(json);
            //calcStats();
            //createPopupContent();
            //createSymbols();
            //createSequenceControl();
            console.log(stations);
            layerControl.addOverlay(stations,"Subway Stations");
            stations.addTo(map);
        })
}


document.addEventListener('DOMContentLoaded',createMap)