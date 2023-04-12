# NYC Transit 

### Team Members
Logan DeMars, Luke Casesa

### Final Proposal
1. Persona/Scenario
    1. Persona
    2. Scenario
2. Requirements Document    

| Representation |               |                                                                                                                                                              |
| :------------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | Basemap       | Map of entire New York City area: Street view                                                                                                                |
| 2              | Census tracts | Census tract polygons on top of basemap and below subway/bus data https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page        |
| 3              | Subway        | Location of subway stations (points) and routes (polylines) https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive |
| 4              | Bus           | Location of bus stops (points) and routes (polylines) https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive       |
| 5              | Yearly Graph  | Shows yearly ridership data for selected route/station, line graph.                                                                                          |
| 6              | Legend        | Describes visual depictions of census tracts, routes, and stops                                                                                              |
| 7              | Context       | Map information alongside guide and context for users                                                                                                        |

| Interaction |                    |                                                                                                                                                                                                                       |
| :---------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1           | Layer Toggle       | Overlay: Bus, subway, census data (income, family households, etc) layers togglable using check boxes                                                                                                                 |
| 2           | Query Panel        | Search: User inputs census block or address, map highlights and retrieves data. Includes autofill.                                                                                                                    |
| 3           | Year Panel         | Sequence: Allows user to scroll through data from 2015-2020                                                                                                                                                           |
| 4           | Route & Stop hover | Retrieve: Hover over bus or subway route/stop to get ridership details, list of stops, current stop.                                                                                                                  |
| 5           | Census block hover | Retrieve: Shows census tract ID and data being displayed.                                                                                                                                                             |
| 6           | Census Select      | Retrieve/Resymbolize: When a user selects a census block, it changes color and a graphic pops up on the side that shows the rank of the block, alongside multiple blocks directly above and below it in the rankings. |
| 7           | Transit Select     | Resymbolize: Line graph displays current transit data, with the present map being indicated with a highlighted dot on the graph.                                                                                      |


    Bus & subway ridership data (csv): https://new.mta.info/agency/new-york-city-transit/subway-bus-ridership-2020 

    NYC Mass Transit Spatial Layers (shp): https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive  

    NYC Open Data 2019 Subway Station (shp, point) https://data.cityofnewyork.us/Transportation/Subway-Stations/arq3-7z49 

    NYC Open Data 2019 Subway Routes (shp, polyline) https://data.cityofnewyork.us/Transportation/Subway-Lines/3qz8-muuu

    NYC census tracts (shp, polygon) https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page

    NYC census data (csv): https://www.nyc.gov/site/planning/planning-level/nyc-population/2020-census.page

3. Wireframes






