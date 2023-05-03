var map;
var filePath = ["data/tracts_rank.geojson", 
                "data/subway_lines.geojson", 
                "data/subway_stations.geojson"];

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [40.7, -74.006], //Centered on NYC (lat/long)
        zoom: 11,
        minZoom: 9,
        zoomControl: false //initialize without default zoom control to allow for placement options later
    });

    //Add zoom control with custom options
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    //Create OSM base tilelayer and save to variable
    var baseLayer = {"Open Street Map": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 3,
        maxZoom: 19
    })};

    //Add OSM base layer to map.
    baseLayer["Open Street Map"].addTo(map);

    //Create overlay control, initialized with baseLayer and no overlays. 
    var overlays 
    var layerControl = L.control.layers(baseLayer, overlays).addTo(map);

    //Initializes info controller. No data added until later when user clicks on feature.
    createInfoControl(map);

    //call data functions - adds each to map. Three separate functions required as we need to perform different tasks for each(?).
    tractData(filePath[0],layerControl,map);//Pass in filePath array value, overlay controller, and map variables.
    lineData(filePath[1],layerControl,map);
    stationData(filePath[2],layerControl,map);
};

function createInfoControl(){
    
    info = L.control(); //Custom controller is generated as a GLOBAL variable.

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info" for css
        this.update();
        return this._div;
    };

    // method that is called to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Census Tract ID: ' + props.BoroCT2020 + '</b><br />Accessibility Rank: '+props.Sub_RankMi + ' '
            : '');
    };

    info.addTo(map); 
    return info;
}


//Add event listeners for hover interaction and click  interaction (tracts only currently)
function onEachFeatureTract(feature, layer) {
    prevLayerClicked = null; //Global variable declared for later use in highlightFeatureClick.
    //Two separate mouse interactions included - hovering & clicking.
    layer.on({
        mouseover: highlightFeatureHover,
        mouseout: resetHighlightHover,
        click: highlightFeatureClick
         
    });
}

//This function colors the polygon when it is clicked, adds the information to the Info Controller, and resets styling for previously clicked polygon.
function highlightFeatureClick(e) {
    
    //Checks if a pre-existing selection exists. If so it resets the styling.
    if (prevLayerClicked !== null) {
        // Reset style  
        prevLayerClicked.setStyle({
            weight: 2,
            fillColor: 'blue',
            fillOpacity: 0.5
        });
    }


    var layer = e.target;
    console.log(layer.feature.properties);

    info.update(layer.feature.properties)//Runs info.update function. (info is a global variable, required for this to work)

    layer.setStyle({ //Sets selection color when a polygon is clicked
        weight: 5,
        fillOpacity: 0.7,
        fillColor: 'red'
    });

    layer.bringToFront();
    prevLayerClicked = layer; //Stores clicked layer to be checked later. Basically makes this function a loop if you are repeatedly clicking features.
}

function highlightFeatureHover(e) {
    var layer = e.target;
    //console.log(layer.feature.properties);
    
    
    layer.bindPopup(e.target.feature.properties.BoroCT2020,{className: 'mouseoverpopup'}) //Adds hover pop up to layer object - assign class name for css
    layer.openPopup(); //Opens pop up while hovering over it.
    
    //Sets style when mouse is hovering over polygon
    layer.setStyle({
        weight: 5,
        fillOpacity: 0.7
    });

    layer.bringToFront();
}


function resetHighlightHover(e) {
    var layer = e.target;
    
    layer.setStyle({ //Resets style to original
        weight: 2,
        //fillColor: 'blue',
        fillOpacity: 0.5
    });
    layer.closePopup(); //Closes popup when mouse goes off of polygon
}


//
//Fetch functions
//
function tractData(input,layerControl){
    
    var tractStyle = {
        fillColor: 'blue',//getColor(feature.properties.density),
        weight: 2,
        opacity: 0.9,
        color: 'white',
        fillOpacity: 0.5}

    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){        
            var tracts = L.geoJson(json,{style: tractStyle,
                onEachFeature: onEachFeatureTract});
            console.log(tracts);

            //calcStats();
            //createChoropleth();
            //createLegend();

            layerControl.addOverlay(tracts,"Tracts");
            //tracts.addTo(map);
            
        })
}

function lineStyleColor(d) {
    console.log(d);

    return  d == "A" ? "#0039a6" : 
            d == "A-C" ? "#0039a6" :
            d == "C" ? "#0039a6" :
            d == "A-C-E" ? "#0039a6" :
            d == "E" ? "#0039a6" :
            d == "B" ? "#ff6319" :
            d == "B-D" ? "#ff6319" :
            d == "B-D-F-M" ? "#ff6319" :
            d == "D" ? "#ff6319" :
            d == "F" ? "#ff6319" :
            d == "F-M" ? "#ff6319" :
            d == "M" ? "#ff6319" :


            d == "G" ? "#6cbe45" : 

            d == "L" ? "#a7a9ac" :

            d == "J" ? "#996633" :
            d == "J-Z" ? "#996633" :

            d == "N-Q-R-W" ? "#fccc0a" :
            d == "N" ? "#fccc0a" :
            d == "N-Q" ? "#fccc0a" :
            d == "N-Q-R" ? "#fccc0a" :
            d == "N-R" ? "#fccc0a" :
            d == "N-R-W" ? "#fccc0a" :
            d == "N-W" ? "#fccc0a" :
            d == "Q" ? "#fccc0a" :
            d == "R" ? "#fccc0a" :

            d == "1-2-3" ? "#ee352e" :
            d == "1" ? "#ee352e" :
            d == "2" ? "#ee352e" :
            d == "2-3" ? "#ee352e" :

            d == "4-5-6" ? "#00933c" :
            d == "4" ? "#00933c" :
            d == "4-5" ? "#00933c" :
            d == "5" ? "#00933c" :
            d == "6" ? "#00933c" :

            d == "7" ? "#b933ad" :

            d == "T" ? "#00add0" :
            d == "S" ? "#808183" :
                        "#000000" ;
}

function lineStyle(feature){
    return {
        color: lineStyleColor(feature.properties.name),
        weight: 2,
        opacity: 0.75
    }
}
function lineData(input,layerControl){
    
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            
            var lines = L.geoJson(json,{style: lineStyle});
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