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

    map.createPane('Tracts');
    map.createPane('Lines');

    map.getPane('Tracts').style.zIndex = 450;
    map.getPane('Lines').style.zIndex = 460;


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
    var layerControl = L.control.layers(baseLayer, overlays,{sortLayers: true}).addTo(map);

    //Initializes info controller. No data added until later when user clicks on feature.
    createInfoControl(map);

    //call data functions - adds each to map. Three separate functions required as we need to perform different tasks for each(?).

    lineData(filePath[1],layerControl,map);
    tractData(filePath[0],layerControl,map);//Pass in filePath array value, overlay controller, and map variables.
    stationData(filePath[2],layerControl,map);
    
   
};

function createInfoControl(){
    
    info = L.control(); //Custom controller is generated as a GLOBAL variable.

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info" for css
        this.updateTract();
        return this._div;
    };

    // method that is called to update the control based on feature properties passed
    info.updateTract = function (props) {
        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Census Tract ID: ' + props.BoroCT2020 + '</b><br />Accessibility Rank: '+props.Sub_RankMi + ''
            : '');
    };
    info.updateLine = function (props) {
        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Subway Line: ' + props.name + '</b><br />'
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
            fillColor: '#A0CBCA',
            fillOpacity: 0.5
        });
    }


    var layer = e.target;
    console.log(layer.feature.properties);

    info.updateTract(layer.feature.properties)//Runs info.update function. (info is a global variable, required for this to work)

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

    //layer.bringToFront();
}


function resetHighlightHover(e,geojson) {

    var layer = e.target;
    
    layer.setStyle({ //Resets style to original
        weight: 0.75,
        //fillColor: 'blue',
        fillOpacity: 0.5
    });


    layer.closePopup(); //Closes popup when mouse goes off of polygon
}



function onEachFeatureLine(feature, layer) {
    prevLayerClicked = null; //Global variable declared for later use in highlightFeatureClick.
    //Two separate mouse interactions included - hovering & clicking.
    layer.on({
        mouseover: highlightFeatureHoverLine,
        mouseout: resetHighlightHoverLine,
        click: highlightFeatureClick
         
    });
}

function highlightFeatureHoverLine(e) {
    var layer = e.target;
    //console.log(layer.feature.properties);
    
    
    layer.bindPopup(e.target.feature.properties.name,{className: 'mouseoverpopupLine'}) //Adds hover pop up to layer object - assign class name for css
    layer.openPopup(); //Opens pop up while hovering over it.
    
    //Sets style when mouse is hovering over polygon
    layer.setStyle({
        weight: 7,
        opacity: 1
    });

    //layer.bringToFront();
}

function resetHighlightHoverLine(e,layer) {
    //json.resetStyle(e.target);

    var layer = e.target;
    
    layer.setStyle({ //Resets style to original
        weight: 5,
        //fillColor: 'blue',
        opacity: 0.75
    });


    layer.closePopup(); //Closes popup when mouse goes off of polygon
}

///
//Style functions
///

function lineStyle(feature){
    return {
        color: lineStyleColor(feature.properties.name),
        weight: 5,
        opacity: 0.75,
        className: 'SbLine'
    }
}

function tractStyle(feature){
    return {
        fillColor: '#A0CBCA',//getColor(feature.properties.density),
        weight: 0.75,
        opacity: 0.9,
        color: 'white',
        fillOpacity: 0.5,
        className: 'tractPoly'
        
    }
}

function lineStyleColor(d) {
    //console.log(d);

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

//
//Fetch functions
//

function lineData(input,layerControl){
    
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            
            var lines = L.geoJson(json,{
                style: lineStyle,
                renderer: L.svg({pane: 'Lines'}),
                pane:{pane: 'Lines'},
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function () {
                        this.bindPopup(this.feature.properties.name,{className: 'mouseoverpopupLine'}) //Adds hover pop up to layer object - assign class name for css
                        this.openPopup(); //Opens pop up while hovering over it.
                        this.setStyle({
                            weight: 8,
                            opacity: 1
                        });

                    });
                    layer.on('mouseout', function () {
                        
                        lines.resetStyle(this); //mouseout performed in L.geoJson command to allow for resetStyle to be used.
                    });
                    layer.on('click', function () {
                        //Checks if a pre-existing selection exists. If so it resets the styling.

                        //var layer = e.target;
                        console.log(this.feature.properties);

                        info.updateLine(this.feature.properties)//Runs info.update function. (info is a global variable, required for this to work)
                    });
                }});
            //createLineSymbols();
            //createLinePopups(); //Insert options into command below?

            console.log(lines);
            

            layerControl.addOverlay(lines,"Subway Lines");
            

            lines.addTo(map);
            
            
            //createLegend();  
        })
}

function tractData(input,layerControl){
    prevLayerClicked = null;
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){        
            var tracts = new L.geoJson(json,{
                style: tractStyle,
                renderer: L.svg({pane: 'Tracts'}),
                pane:{pane: 'Tracts'},
                onEachFeature: onEachFeatureTract});

            console.log(tracts);
            
            
            //tracts.style.zIndex=400 
            //calcStats();
            //createChoropleth();
            //createLegend();
         
            layerControl.addOverlay(tracts,"Tracts");
            
            tracts.addTo(map);
            
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