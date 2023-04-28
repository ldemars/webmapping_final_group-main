var map;

//function to instantiate the Leaflet map
function createMap(){
    
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 1
    });
    
    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){

    //load the data
    fetch("data/tracts_rank.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //check that data loaded properly
            console.log(json);
            //create a Leaflet GeoJSON layer and add it to the map

            createStation(json); //This should place the points on the map using the coordinates. Should also add the retrieve data.        

            L.geoJson(json).addTo(map);
        })
};

function createStation(){


}

document.addEventListener('DOMContentLoaded',createMap)