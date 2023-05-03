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
    map.createPane('Stations');

    map.getPane('Tracts').style.zIndex = 450;
    map.getPane('Lines').style.zIndex = 460;
    map.getPane('Stations').style.zIndex = 470;

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
    info.updateStation = function (props) {
        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Subway Station: ' + props.name + '</b><br />'+"Lines: "+props.line
            : '');
    };

    info.addTo(map); 
    return info;
}


//Add event listeners for hover interaction and click  interaction (tracts only currently)
function onEachFeature(feature, layer) {
    prevLayerClicked = null; //Global variable declared for later use in highlightFeatureClick.
    prevColor = null;
    prevFillColor = null;
    
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
        if (prevType == "Polygon"){
        prevLayerClicked.setStyle({
            fillColor: prevFillColor //'#A0CBCA',
        })} else if (prevType == "Line"){
        prevLayerClicked.setStyle({
            color: prevColor //'#A0CBCA',
        })
        }   else if (prevType == "Point"){
            prevLayerClicked.setStyle({
                fillColor: prevFillColor //'#A0CBCA',
            })
            };
    }

    var layer = e.target;
    
    console.log(layer);
    //console.log(layer.feature.properties);
    //console.log(e.target.options);

    console.log(layer.feature.properties);


    //Runs info.update function. (info is a global variable, required for this to work)

    //Checks for type of layer (Polyline vs Polygon) - stores whichever color value is needed.
    if (layer.feature.geometry.type == "LineString"){
        info.updateLine(layer.feature.properties);
        prevType = "Line";
        //console.log(prevType);
        prevColor = e.target.options.color;
        layer.setStyle({ //Sets selection color when a polygon is clicked
            color: 'red'
        });
    }   else if(layer.feature.geometry.type == "Polygon") {
        info.updateTract(layer.feature.properties);
        prevType = "Polygon";
        //console.log(prevType);
        prevFillColor = e.target.options.fillColor;
        layer.setStyle({ //Sets selection color when a polygon is clicked
        fillColor: 'red'
        
    })}
        else if(layer.feature.geometry.type == "Point") {
        info.updateStation(layer.feature.properties);
        prevType = "Point";
        //console.log(prevType);
        prevFillColor = e.target.options.fillColor;
        layer.setStyle({ //Sets selection color when a polygon is clicked
        fillColor: 'red'
        
    })}
    ;

    prevLayerClicked = layer; //Stores clicked layer to be checked later. Basically makes this function a loop if you are repeatedly clicking features.
}

function highlightFeatureHover(e) {
    var layer = e.target;

    var key1 = Object.keys(e.target.feature.properties)[0]

    layer.bindPopup(e.target.feature.properties[key1],{className: 'mouseoverpopup'}) //Adds hover pop up to layer object - assign class name for css
    layer.openPopup(); //Opens pop up while hovering over it.
    
    //Sets style when mouse is hovering over polygon
    layer.setStyle({
        weight: e.target.options.weight+4,
        fillOpacity: e.target.options.fillOpacity+0.1
    });

    //layer.bringToFront();
}


function resetHighlightHover(e,geojson) {

    var layer = e.target;
    
    layer.setStyle({ //Resets style to original
        weight: e.target.options.weight-4,
        //fillColor: 'blue',
        fillOpacity: e.target.options.fillOpacity-0.1
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
                onEachFeature: onEachFeature
                
            });
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
                onEachFeature: onEachFeature});

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
    var markerOptions = {
        radius: 5,
        fillColor:'white',
        color:'black',
        weight:4,
        opacity:1,
        fillOpacity:0.8,
        renderer: L.svg({pane: 'Stations'}),
        pane:{pane: 'Stations'}
    }
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            var stations = new L.geoJson(json,{onEachFeature: onEachFeature,
                pointToLayer: function(feature,latlng){
                    return L.circleMarker(latlng,markerOptions);},
                
                
                
            });
            //calcStats();
            //createPopupContent();
            //createSymbols();
            //createSequenceControl();
            console.log(stations);
            layerControl.addOverlay(stations,"Subway Stations");
            stations.addTo(map);
        })
}

function OnEachFeatureStation(feature, layer) {
    prevLayerClicked = null; //Global variable declared for later use in highlightFeatureClick.
    //Two separate mouse interactions included - hovering & clicking.
   console.log(layer);
    layer.on({
        mouseover: highlightFeatureHoverStation,
        mouseout: resetHighlightHoverStation,
        click: highlightFeatureClick
         
    });
}

function highlightFeatureHoverStation(e) {
    var layer = e.target;
    //console.log(layer.feature.properties);
    
    
    layer.bindPopup(e.target.feature.properties.name,{className: 'mouseoverpopupStation'}) //Adds hover pop up to layer object - assign class name for css
    layer.openPopup(); //Opens pop up while hovering over it.
    
    //Sets style when mouse is hovering over polygon
    layer.setStyle({
        fillColor:'red',
    });

    //layer.bringToFront();
}

function resetHighlightHoverStation(e,layer) {
    //json.resetStyle(e.target);

    var layer = e.target;
    
    layer.setStyle({ //Resets style to original
        weight: 5,
        //fillColor: 'blue',
        opacity: 0.75
    });


    layer.closePopup(); //Closes popup when mouse goes off of polygon
}


document.addEventListener('DOMContentLoaded',createMap)