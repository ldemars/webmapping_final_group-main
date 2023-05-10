# New York City Transit Service Quality

## Team Members
Logan DeMars, Luke Casesa

## GEOG 575 Final Project Proposal
### Persona/Scenario
1. Target User Profile (Persona):

    **Name & Position:** John Appleseed,  MTA Construction & Development Data Specialist

    **Background Description:** John is a Metropolitan Transportation Authority (MTA) supervisor who is interested in reassessing the efficiency and total service coverage trends of the current public transportation systems across New York City. As a supervisor, the priority is to upkeep the transit systems without major interruptions, and to be provided **insights** to make sure the subway system is meeting goals of servicing the entire city keeping in mind differences in weekday and weekend ridership. By using the interactive map, he hopes to **compare** multiple ridership datasets over multiple years, and **rank** census tracts by transit accessibility to **identify** stations that are **outliers**. 

	As a supervisor of a major urban center that is rapidly developing, it is important to keep up with the latest information pertaining to public transportation. For this reason, using temporal multivariate data provides crucial information for catching developing ridership **trends** and **patterns** early, to allow for new routes to be created and planned going forward. 

2. User Case Scenarios
    1. Scenario #1: 
    When opening the interactive NYC transportation map, the user sees the query search and decides to look up his address. The user then sees that the census tract highlighted on the map, which helps the user **associate** this with his location. The user notices after clicking on each station, he is able to **compare** and **identify** that the second station to his south attracts noticeably more riders than the other. Alongside the pop up, the subway lines become highlighted, showing that he can get onto the same train line using the south station. For this reason, John decides to start going to work using the south station, in order to avoid being crowded while waiting for a train. 

    2. Scenario #2:
    Upon opening the interactive, the user (John Appleseed) is prompted to choose whether to start with the subway map. Then, the user is prompted to enter basic information about their itinerary: day of week, time of day, origin station, and destination station. From this query, the user is shown a map of their travel route. As a MTA Construction & Development Data Specialist, John is concerned about the efficiency and to see if the subway system is meeting goals without bias. The user is drawn to the polylines that represent subway lines and **associates** line stroke width to efficiency and performance. The user can **compare** different routes and route combinations to see which is the most efficient across time and space. Hovering over the 4/5/6 line, the user **identifies** that it has the most riders of any line in the city. The user can then go to a table **ranking** ridership for that specific day across all lines to see where the 4/5/6 line ranks among others. After comparing the 4/5/6 line and the N/Q/R line, John decides to take the N/Q/R line to minimize his chances of the train being full.


### Requirements Document    

| # |   Representation              |                                                                                                                                                       |
| :------------- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | Basemap         | Map of entire New York City area: Street view                                                                                                         |
| 2              | Census tracts   | Census tract polygons on top of basemap and below subway data https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page |
| 3              | Subway Lines    | Location of subway routes indicated by colored polylines https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive                |
| 4              | Subway Stations | Location of subway stations represented by proportional symbols https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive                 |
| 5              | Ridership       | Ridership data displayed using proportional symbols.                                                                                   |
| 6              | Context         | Map information alongside guide and context for users                                                                                                 |

| # |  Interaction                   |                                                                                                                 |
| :---------- | :------------------ | :--------------------------------------------------------------------------------------------------------------- |
| 1           | Overlay Control     | Overlay: User controls the visibility of subway polyline, station point, and census polygon layers.              |
| 2           | Sequence Slider     | Sequence: Allows user to scroll through ridership data from 2015-2020, resizing station circle radius that indicates ridership.                                            |
| 3           | Retrieve Hover      | Retrieve: When a user hovers over a feature, a retrieve popup will show the name of the feature.                 |
| 4           | Resymbolize Hover   | Resymbolize: When a user hovers over a feature, the feature will be slightly highlighted through opacity         |
| 5           | Retrieve Select     | Retrieve: When a user clicks a feature, a retrieve panel will return information about that feature.             |
| 6           | Resymbolize Select  | Resymbolize: When a user clicks on a feature, the feature will be resymbolized to red.                           |
| 7           | Filter   Menu       | Filter: Dropdown menu giving user choice between weekday and weekend data.                                       |
| 8           | Zoom Control        | Allows user to zoom in and out.                                                                                  |
    
### Wireframes
![wireframe_1-draft 2](https://user-images.githubusercontent.com/99845984/232179771-e4085b7b-caca-4d42-b693-047300a5ab6f.jpg)
![wireframe_2-draft2](https://user-images.githubusercontent.com/99845984/232179772-621c0ca9-baa1-4e23-bdf0-9467d0c42c7a.jpg)
![wireframe_6](https://user-images.githubusercontent.com/99845984/232179782-aa724ed7-7087-42b2-a582-d61d0dbc2d1c.jpg)
![wireframe_3](https://user-images.githubusercontent.com/99845984/231393813-8c366e45-3517-4b5e-8080-dbd520895e33.jpg)


![wireframe 4](https://user-images.githubusercontent.com/117290490/231512169-ac251e91-c0ae-4e92-89d4-dd87e5143535.jpeg)
![wireframe 5](https://user-images.githubusercontent.com/117290490/231512189-272060c2-10fd-4fcd-9935-46170bd058a8.jpeg)
