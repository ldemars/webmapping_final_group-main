var map;
var filePath = ["data/tracts_rank.geojson", 
                "data/subway_lines.geojson", 
                "data/subway_stations.geojson"];

var currentYear = "WD_2015";
var stations;

var layerSelected = null;
var year = "2015";
var frame = "WD_";

/*
    var type = "WD"
    currentYear = type + "_2015"

    //in your sequence
    currentyear = type + "_" + index
*/

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
        position: 'topleft'
    }).addTo(map);

    //Create separate map panes for each geojson layer.
    map.createPane('Tracts');
    map.createPane('Lines');
    map.createPane('Stations');

    //Set zIndex to order the layers regardless of overlay order.
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

    info.onAdd = function (map) { //Initializes info controller.
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info" for css
        this.updateTract(); //Initializes with updateTract for "Click to select feature" text
        return this._div;
    };

    // methods that will be called to update the control based on feature properties passed
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
        var dataset = "";
        if (frame == "WD_") {
            dataset = "Week Day";
        } else if(frame == "WE_"){
            dataset = "Weekend";
        };

        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Subway Station: ' + props.name + '</b><br />'+"Lines: "+props.line+'<br />'+currentYear.slice(3) + " " + dataset + " " +" Ridership: " +props[currentYear]+""
            : '');
    };

    info.addTo(map); //Adds initialized info controller to map: Or updates map after each methods.
    return info;
}

///
/// Event Listener Functions
///

//Add event listeners for hover interaction and click  interaction (tracts only currently)
function onEachFeature(feature, layer) {
    prevLayerClicked = null; //Global variable declared for later use in highlightFeatureClick.
    prevColor = null;
    
    //Two separate mouse interactions included - hovering & clicking.
    layer.on({
        mouseover: highlightFeatureHover,
        mouseout: resetHighlightHover,
        click: highlightFeatureClick
         
    });
}

//This function colors the polygon when it is clicked, adds the information to the Info Controller, and resets styling for previously clicked polygon.
function highlightFeatureClick(e) {
    
    //Checks if a pre-existing selection exists. 
    //Then checks the type of layer the selection was using prevType.
    //If a match occurs resets the styling using stored prevColor.
    //This allows for the subway line colors to be remembered with no need for hard coding.
    if (prevLayerClicked !== null) {
        // Reset style  
        if (prevType == "Polygon" || prevType == "MultiPolygon"){
        prevLayerClicked.setStyle({
            fillColor: prevColor //'#A0CBCA'
        })} else if (prevType == "Line"){
        prevLayerClicked.setStyle({
            color: prevColor 
        })
        }   else if (prevType == "Point"){
            prevLayerClicked.setStyle({
                fillColor: prevColor 
            })
            };
    }

    layerSelected = e.target; //Saves targeted layer to global variable.
    console.log(layerSelected.feature.properties);


    //Runs info.update function. (info is a global variable, required for this to work)

    //Checks for type of layer (Polyline vs Polygon vs Point) - performs styling and updates info controller accordingly.
    if (layerSelected.feature.geometry.type == "LineString"){
        info.updateLine(layerSelected.feature.properties); //Updates info controller
        prevType = "Line"; //Stores type
        prevColor = layerSelected.options.color; //Stores color of layer
        layerSelected.setStyle({ //Sets selection color when a feature is clicked
            color: 'red'
        });
    }   else if(layerSelected.feature.geometry.type == "Polygon" || layerSelected.feature.geometry.type == "MultiPolygon") {
        info.updateTract(layerSelected.feature.properties);
        prevType = "Polygon";
        prevColor = layerSelected.options.fillColor;
        layerSelected.setStyle({ //Sets selection color when a feature is clicked
        fillColor: 'red'
        
    })}
        else if(layerSelected.feature.geometry.type == "Point") {
        info.updateStation(layerSelected.feature.properties);
        prevType = "Point";
        prevColor = layerSelected.options.fillColor;
        layerSelected.setStyle({ //Sets selection color when a feature is clicked
        fillColor: 'red'
        
    })}
    ;

    prevLayerClicked = layerSelected; //Stores clicked layer to be checked later. Basically makes this function a loop if you are repeatedly clicking features.
}

function highlightFeatureHover(e) {
    var layer = e.target;
    var key1
    //Opens pop up while hovering over it.
    
    //Sets style when mouse is hovering over polygon

    if (layer.feature.geometry.type == "LineString" || layer.feature.geometry.type == "Polygon" || layer.feature.geometry.type == "MultiPolygon"){
        key1 = Object.keys(layer.feature.properties)[0]
        layer.setStyle({
            weight: layer.options.weight+4,
            fillOpacity: layer.options.fillOpacity+0.1}
    )} else if (layer.feature.geometry.type == "Point"){
        key1 = Object.keys(layer.feature.properties)[1]
        layer.setStyle({
            fillOpacity: layer.options.fillOpacity+0.1})
    };

    layer.bindPopup(layer.feature.properties[key1],{className: 'mouseoverpopup'}) //Adds hover pop up to layer object - assign class name for css
    layer.openPopup(); 
    //layer.bringToFront();
}


function resetHighlightHover(e,geojson) {

    var layer = e.target;
    
    if (layer.feature.geometry.type == "LineString" || layer.feature.geometry.type == "Polygon" || layer.feature.geometry.type == "MultiPolygon"){
        layer.setStyle({
            weight: layer.options.weight-4,
            fillOpacity: layer.options.fillOpacity-0.1}
    )} else if (layer.feature.geometry.type == "Point"){
        layer.setStyle({
            fillOpacity: layer.options.fillOpacity-0.1})
    };


    layer.closePopup(); //Closes popup when mouse goes off of polygon
}

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

function createSequenceControls(input){

    var SequenceControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'panel');

            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

            //add skip buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/back.png"></button>'); 
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward.png"></button>'); 

            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    map.addControl(new SequenceControl()); 

    //set slider attributes
    document.querySelector(".range-slider").min = 2015;
    document.querySelector(".range-slider").max = 2020;
    document.querySelector(".range-slider").value = 2015;
    document.querySelector(".range-slider").step = 1;


    var steps = document.querySelectorAll('.step');
  
    //document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

    steps.forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;
            console.log(index)

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 2020 ? 2015 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 2015 ? 2020 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            currentYear = "WD_" + index;

            //Performs info controller update for when using buttons.
            controlInfoUpdate();

            stations.setStyle(function(feature){
                //console.log(feature.properties[currentYear]);
                var value = feature.properties[currentYear].replace(',','');
                return{
                    radius:calcRadius(parseInt(value))
                }
            })
            //Step 9: pass new attribute to update symbols
            //updatePropSymbols(attributes[index]);
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //Step 6: get the new index value
        var index = this.value;
        currentYear = frame + index;
        stations.setStyle(function(feature){
            var value = feature.properties[currentYear].replace(',','');
            return{
                radius:calcRadius(parseInt(value))
            }
        })

        //Performs info controller update for when using the slider.
        controlInfoUpdate();

        //Step 9: pass new attribute to update symbols
        //updatePropSymbols(attributes[index]);
        //info.updateStation(feature.properties[currentYear]);
    });
};

function controlInfoUpdate(){
    if (layerSelected != null){
        if (layerSelected.feature.geometry.type == "Point"){
            info.updateStation(layerSelected.feature.properties);
        }
    };
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
        fillColor: createChoro(feature.properties.Sub_RankMi), //'#A0CBCA'
        weight: 0.75,
        opacity: 0.9,
        color: 'white',
        fillOpacity: 0.5,
        className: 'tractPoly'
        
    }
}


function createChoro(d) {
    
    var d = Number(d);
    
    return  d < 1500 ? "#e9e9e9":
            d < 1000 ? "#d4d4d4":
            d < 500 ? "#9a9a9a":
            d < 250 ? "#707070":
            d < 100 ? "#454545":
                      "#464949";

}

function lineStyleColor(d) {
    //console.log(d);

    return  d == "A" || d == "A-C" || d == "C" || d == "A-C-E" || d == "E" ? "#0039a6" : 

            d == "B" || d == "B-D" || d == "B-D-F-M" || d == "D" || d == "F" || d == "F-M" || d == "M" ? "#ff6319" :

            d == "G" ? "#6cbe45" : 

            d == "L" ? "#a7a9ac" :

            d == "J" || d == "J-Z"? "#996633" :

            d == "N-Q-R-W" || d == "N" || d == "N-Q" || d == "N-Q-R" || d == "N-R" || d == "N-R-W" || d == "N-W" || d == "Q" || d == "R" ? "#fccc0a" :
    
            d == "1-2-3" || d == "1" || d == "2" || d == "2-3" || d == "3" ? "#ee352e" :
   
            d == "4-5-6" || d == "4" || d == "4-5" || d == "5" || d == "6" ? "#00933c" :

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
            //createLegend();
         
            layerControl.addOverlay(tracts,"Tracts");
            
            //tracts.addTo(map);
            
        })
}

function stationData(input,layerControl,map){
    var markerOptions = {
        radius: 2.2,
        fillColor:'white',
        color:'black',
        weight:2.5,
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
            stations = new L.geoJson(json,{onEachFeature: onEachFeature,
                pointToLayer: function(feature,latlng){
                    var value = feature.properties[currentYear].replace(',','');
                    markerOptions.radius = calcRadius(parseInt(value))
                    return L.circleMarker(latlng,markerOptions);},                         
            });

            createSequenceControls(stations);
            layerControl.addOverlay(stations,"Subway Stations");
            stations.addTo(map);
        })

 
}
function calcRadius(value)
{
    var dataMin = 100.
        minRadius = 0.5;
    
    if (value && value > 0)
        var radius = 1.0083 * Math.pow(value/dataMin,0.5715) * minRadius;
    else    
        var radius = 0.25;

    return radius;
}

document.addEventListener('DOMContentLoaded',createMap)