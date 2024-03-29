var map;
var filePath = ["data/tracts_rank.geojson", 
                "data/subway_lines.geojson", 
                "data/subway_stations.geojson"]; //file paths stored in an array.
var stations;

var layerSelected = null; //Initializes global select - starts user with no selection.
var year = "2015"; //Initializes year - starts user at 2015
var frame = "WD_"; //Initializes frame - starts user on weekdays.

//function to instantiate the Leaflet map
function createMap(){
    "testing"
    //Create bound options, store in variable bounds to be called when making map.
    var southWest = L.latLng(40.3, -75.1),
        northEast = L.latLng(41.2, -73.100),
        bounds = L.latLngBounds(southWest, northEast);

    //create the map
    map = L.map('map', {
        center: [40.74, -74.006], //Centered on NYC (lat/long)
        zoom: 11,
        minZoom: 9,
        maxBounds: bounds,
        zoomControl: false //initialize without default zoom control to allow for placement options later
    });

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

    //Create overlay control, initialized with baseLayer and no overlays. Sort layers alphabetically 
    var overlays 
    var layerControl = L.control.layers(baseLayer, overlays,{sortLayers: true,position:'bottomleft'}).addTo(map);

    //Initializes info controller. No data added until later when user clicks on feature.
    createInfoControl(map);

    //call data functions - adds each to map. Three separate functions required as we need to perform different tasks for each(?).
    lineData(filePath[1],layerControl,map);
    tractData(filePath[0],layerControl,map);//Pass in filePath array value, overlay controller, and map variables.
    stationData(filePath[2],layerControl,map);
    
    
   
    //Add zoom control with custom options
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    var windOpen = L.control.window(map,{
        title:"Hello and Welcome to our Geography 575 Final Project!",
        content: " This is an interactive user experience designed to help MTA riders understand commuting and the subway system based on historical ridership data and census accessibility ranks. You can use the slider in the top left to cycle through ridership data years, use the weekend/weekday button to switch between, use the layers button to toggle layer visibility, use the (+) (-), pinch, or double tap to zoom, and select line, station, and census block features by clicking for a retrieve pop up.  ",
        visible:true})
    
};

function createInfoControl(){
    
    info = L.control({position: 'bottomright'}); //Custom controller is generated as a GLOBAL variable. This allows for the methods to be called in other functions.

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
        var dataString = "";
        //Checks what the data frame being used is. Stores a string depending on whether weekday or weekend is being used for use in print.
        if (frame == "WD_") {
            dataString = "Weekday";
        } else if(frame == "WE_"){
            dataString = "Weekend";
        };

        var dataNum
        //Checks if the feature being passed in has no data. If it does have no data, stores a string. Otherwise stores the data.
        if (props[frame+year] == ""){
            dataNum = "No data";
        } else {
            dataNum = props[frame+year];
        }
        
        //Prints string to info controller using dataString and dataNum.
        this._div.innerHTML = 
            '<h4>Click to select feature</h4>' +  (props ?
            '<b>Subway Station: ' + props.name + '</b><br />'+"Lines: "+props.line+'<br />'+year + " " + dataString + " " +" Ridership: " +dataNum+""
            : '');
    };

    info.addTo(map); //Adds initialized info controller to map: Or updates map after each methods.
    return info;
}

///
/// Select and hover event listener functions
///

//Add event listeners for hover interaction and click  interaction (tracts only currently)
function onEachFeature(feature, layer) {
    
    //Global variables declared for later use in highlightFeatureClick.
    prevLayerClicked = null; 
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

    //Stores current selection to a global variable. 
    layerSelected = e.target; 

    //Checks for type of layer (Polyline vs Polygon vs Point) - performs styling and updates info controller accordingly.
    if (layerSelected.feature.geometry.type == "LineString"){
        info.updateLine(layerSelected.feature.properties); //Updates info controller
        prevType = "Line"; //Stores type for when new selection is performed by user.
        prevColor = layerSelected.options.color; //Stores color of layer for when new selection is performed by user.
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

//Opens pop up while hovering over it.
function highlightFeatureHover(e) {
    var layer = e.target;
    var key1
    
    //If statements create symbology changes when mouse is hovering over a feature.
    if (layer.feature.geometry.type == "LineString" || layer.feature.geometry.type == "Polygon" || layer.feature.geometry.type == "MultiPolygon"){
        key1 = Object.keys(layer.feature.properties)[0] //Gets first key from data, stores to be used in popup.
        layer.setStyle({ //Sets style when mouse is hovering over polygon or line
            weight: layer.options.weight+4, //Makes line weight heavier by adding 4
            fillOpacity: layer.options.fillOpacity+0.1} //Makes fill opacity higher by adding .1
    )} else if (layer.feature.geometry.type == "Point"){ //Checks if geojson layer is a point layer
        key1 = Object.keys(layer.feature.properties)[1] 
        layer.setStyle({ //Sets style when mouse is hovering over point
            fillOpacity: layer.options.fillOpacity+0.1}) //Makes fill opacity higher by adding .1
    };

    //Binds hover popup.
    layer.bindPopup(layer.feature.properties[key1],{className: 'mouseoverpopup',offset: L.point(0,-15)}) //Adds hover pop up to layer object - assign class name for css

    //Opens pop up after binding
    layer.openPopup(); 
}


function resetHighlightHover(e,geojson) {

    var layer = e.target;
    
    //If statement performs symbology changes when mouse is no longer hovering over a feature.
    if (layer.feature.geometry.type == "LineString" || layer.feature.geometry.type == "Polygon" || layer.feature.geometry.type == "MultiPolygon"){
        layer.setStyle({ //Resets style by performing opposite mathematical operations to the style options.
            weight: layer.options.weight-4,
            fillOpacity: layer.options.fillOpacity-0.1}
    )} else if (layer.feature.geometry.type == "Point"){
        layer.setStyle({
            fillOpacity: layer.options.fillOpacity-0.1})
    };

    layer.closePopup(); //Closes popup when mouse goes off of polygon. 
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

function createSequenceControls(){

    //Initializes sequence control
    var SequenceControl = L.Control.extend({
        options: {
            position: 'topleft' //Places sequence controller in top right corner of map
        },
        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'panel');

            //Create header for sequence controller. Initializes to 2015. ID given so it can be changed in event listener below.
            container.insertAdjacentHTML('beforeend','<h4 id="seqHeader">Year: '+year+'</h4>');

            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">');

            //add skip buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/back_v2.png"></button>'); 
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward_v2.png"></button>'); 

            L.DomEvent.disableClickPropagation(container);

            return container;
        },
    });

    map.addControl(new SequenceControl()); 

    //set slider attributes
    document.querySelector(".range-slider").min = 2015;
    document.querySelector(".range-slider").max = 2020;
    document.querySelector(".range-slider").value = 2015;
    document.querySelector(".range-slider").step = 1;


    var steps = document.querySelectorAll('.step');
  

    steps.forEach(function(step){
        step.addEventListener("click", function(){ //Adds button event listeners.
            var index = document.querySelector('.range-slider').value; 

            //increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //if past the last index attribute, wrap around to first attribute
                index = index > 2020 ? 2015 : index;
            } else if (step.id == 'reverse'){
                index--;
                //if past the first index attribute, wrap around to last attribute
                index = index < 2015 ? 2020 : index;
            };

            //update slider with button clicks.
            document.querySelector('.range-slider').value = index;

            year = index;

            //Performs info controller update for when using buttons with new global year value.
            updateInfoIndexYear();
            updatePropSymbols();

            //Updates sequence controller header to new global year value. 
            seqHeader.innerText = "Year: "+year;

        })
    })

    //event listener for the slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //get the new index value
        var index = this.value;
        year = index; //Store new year to global year variable.
        
        //Performs info controller update for when using buttons with new global year value.
        updateInfoIndexYear();
        updatePropSymbols();

        //Updates sequence controller header to new global year value. 
        seqHeader.innerText = "Year: "+year;

    });
};

function updateInfoIndexYear(){
    if (layerSelected != null){ //Checks if a layer has been selected
        if (layerSelected.feature.geometry.type == "Point"){ //Checks type of layer
            info.updateStation(layerSelected.feature.properties); //If a point selected was previously selected, updates info controller. 
        }
    };
}

function updatePropSymbols(){
    stations.setStyle(function(feature){ //Sets style for each stations value.
        var value = feature.properties[frame+year].replace(',',''); //Each value has comma removed so it is just a number.
        return{
            radius:calcRadius(parseInt(value)) //Sends values to calcRadius, returns radius for each point feature.
        }
    })
}

//This function initializes the dropdown menu, and creates an event listener to control the map (changes frame variable instead of year).
function createDropdown(map){

    //Initializes custom dropdown controller, stores to variable
    var dropdown = L.control({position: 'topleft'});
    

    dropdown.onAdd = function(map){
        this._div = L.DomUtil.create('div', 'dropdown'); //Creates dropdown div with class dropdown.
        
        this._div.setAttribute('id','dropdowndiv') //Sets dropdown ID

        //Generates html dropdown. Option values return frame values, selection given ID "days". 
        this._div.innerHTML = '<select id="days"><option value="WD_">Weekday</option><option value="WE_">Weekend</option>'; 
        this._div.firstChild.onmousedown = this._div.firstChild.ondblclick = L.DomEvent.stopPropagation;

        return this._div;
    }

    //Adds dropdown menu to map
    dropdown.addTo(map);

    //Stores current menu value to menu
    var menu = document.getElementById("days");

    //Event listener  for when user changes dropdown menu.
    menu.addEventListener("change", function(){
        frame = menu.value; //Gets current menu value selected in the dropdown menu, saves to global frame variable.
        updateInfoIndexYear(); //Updates info controller  with new day data.

        //Recalculates proportional symbols with new frame value.
        updatePropSymbols();

    });
}

///
//Style functions
///

function calcRadius(value) //Passed in values have radius calculated.
{
    var dataMin = 100.
        minRadius = 0.5; //Set minimum radius of proportional symbols.
    
    if (value && value > 0)
        var radius = 1.0083 * Math.pow(value/dataMin,0.5715) * minRadius;
    else    
        var radius = 0.25;

    return radius;
}

function lineStyle(feature){ //Returns line style data. Calls lineStyleColor on each feature that passes through.
    return {
        color: lineStyleColor(feature.properties.name),
        weight: 5,
        opacity: 0.75,
        className: 'SbLine'
    }
}

function tractStyle(feature){ //Returns tract style data. Calls createChoro on each feature that passes through.
    
    return {
        fillColor: createChoro(feature.properties.Sub_RankMi), //'#A0CBCA'
        weight: 0.75,
        opacity: 0.9,
        color: 'white',
        fillOpacity: 0.5,
        className: 'tractPoly'
        
    }
}


function createChoro(d) { //Passed in values have color assigned, returns color hex code.
    var d = Number(d); //Makes passed in input is a number.
    
    //If statement uses ranges to determine color of polygon.
    return  d >= 1500 && d < 2000 ? "#464949":
            d >= 1000  && d < 1500 ? "#454545":
            d < 1000 && d >= 500 ? "#707070":
            d < 500 && d >= 250 ? "#9a9a9a":
            d < 250 && d >= 100 ? "#d4d4d4":
            d < 100 && d >= 0 ? "#e9e9e9": 
                                 "#000000"; 

}

function lineStyleColor(d) { //Passed in values have color assigned, returns color hex code.

    //If statement checks which subway line is being pass through.
    return  d == "A" || d == "A-C" || d == "C" || d == "A-C-E" || d == "E" ? "#0039a6" : 

            d == "B" || d == "B-D" || d == "B-D-F-M" || d == "D" || d == "F" || d == "F-M" || d == "M" ? "#ff6319" :

            d == "G" ? "#6cbe45" : 

            d == "L" ? "#FFC0CB" :

            d == "J" || d == "J-Z"? "#996633" :

            d == "N-Q-R-W" || d == "N" || d == "N-Q" || d == "N-Q-R" || d == "N-R" || d == "N-R-W" || d == "N-W" || d == "Q" || d == "R" ? "#fccc0a" :
    
            d == "1-2-3" || d == "1" || d == "2" || d == "2-3" || d == "3" ? "#ee352e" :
   
            d == "4-5-6" || d == "4" || d == "4-5" || d == "5" || d == "6" ? "#00933c" :

            d == "7" ? "#b933ad" :

            d == "T" ? "#00add0" :

            d == "S" ? "#7120b3" :
                        "#000000" ;
}



//
//Fetch functions
//

function lineData(input,layerControl){ //Loads subway line geojson. 
    //Inputs are the file path to the geojson, and the overlay controller.
    
    fetch(input) 
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            
            var lines = L.geoJson(json,{
                style: lineStyle, //Runs lineStyle to get style options for each line.
                renderer: L.svg({pane: 'Lines'}),
                pane:{pane: 'Lines'}, //Assigns pane to Lines pane.
                onEachFeature: onEachFeature //Listeners implemented.        
            });

            //console.log(lines);

            layerControl.addOverlay(lines,"Subway Lines"); //Adds geojson layer to overlay control.
            

            lines.addTo(map); //Initializes map with this layer open.
            
            
            //createLegend();  
        })
}

function tractData(input,layerControl){ //Loads census tract geojson
    //Inputs are the file path to the geojson, and the overlay controller.

    prevLayerClicked = null;
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){        
            var tracts = new L.geoJson(json,{
                style: tractStyle, //Runs tractStyle to get tract symbology.
                renderer: L.svg({pane: 'Tracts'}),
                pane:{pane: 'Tracts'}, //Sets pane to Tracts pane.
                onEachFeature: onEachFeature //Listeners implemented.
            });

            //console.log(tracts);
         
            layerControl.addOverlay(tracts,"Tracts"); //Adds geojson layer to overlay control.
            
            //tracts.addTo(map);
            
        })
}

function stationData(input,layerControl,map){ //Loads station geojson
    //Inputs are the file path to the geojson, and the overlay controller.

    var markerOptions = { //Initializes marker options
        radius: 2.2,
        fillColor:'white',
        color:'black',
        weight:2.5,
        opacity:1,
        fillOpacity:0.8,
        renderer: L.svg({pane: 'Stations'}), 
        pane:{pane: 'Stations'} //Assigns pane to Stations pane within marker options.
    }
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){    
            stations = new L.geoJson(json,{
                onEachFeature: onEachFeature, //Listeners implemented.

                //generates circles at points, using markerOptions. 
                pointToLayer: function(feature,latlng){
                    var value = feature.properties[frame+year].replace(',','');
                    markerOptions.radius = calcRadius(parseInt(value)); //Radius for each marker is calculated.
                    return L.circleMarker(latlng,markerOptions);},                         
            });

            createSequenceControls(); //Initializes sequence controller.
            //Initializes dropdown menu controller.
            createDropdown(map);
            layerControl.addOverlay(stations,"Subway Stations") //Adds geojson layer to overlay control.
            stations.addTo(map); //Initializes map with this layer open.
        })

 
}

//Runs createMap when page is loaded.
document.addEventListener('DOMContentLoaded',createMap)