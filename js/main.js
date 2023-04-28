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

    var filePath = ["data/tracts_rank.geojson", 
                    "data/subway_lines.geojson", 
                    "data/subway_stations.geojson"];
	
        tractData(filePath[0]);
        //lineData(filePath[1]);
        //stationData(filePath[2]);
    
};

function tractData(input){
    fetch(input)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //check that data loaded properly
            console.log(json);
            
            L.geoJson(json).addTo(map);
            
        })
    
    
}



document.addEventListener('DOMContentLoaded',createMap)