# New York City Transit Service Quality

## Team Members
Logan DeMars, Luke Casesa

## GEOG 575 Final Project Proposal
### Persona/Scenario
1. Target User Profile (Persona):

    **Name & Position:** John Doe,  MTA Construction & Development Data Specialist

    **Background Description:** John is a Metropolitan Transportation Authority (MTA) supervisor who is interested in reassessing the efficiency and total service coverage trends of the current public transportation systems across New York City. As a supervisor, the priority is to upkeep the transit systems without major interruptions, and to be provided **insights** to make sure the service is meeting goals of servicing the entire city without any bias caused by demographic factors such as income and race. By using the interactive map, he hopes to **compare** ridership data and various datasets from census tracts over multiple years, and **rank** census tracts by transit accessibility to **identify** features that are **outliers**. 

	As a supervisor of a major urban center that is rapidly developing, it is important to keep up with the latest information pertaining to public transportation. For this reason, using temporal multivariate data provides crucial information for catching developing census and ridership **trends** and **patterns** early, to allow for new routes to be created and planned going forward. 

2. User Case Scenarios
    1. Scenario #1:


    2. Scenario #2:
    Upon opening the interactive, the user (John Appleseed) is prompted to choose whether to start with the subway map or the bus map. Then, the user is prompted to enter basic information about their itinerary: day of week, time of day, origin station, and destination station. From this query, the user is shown a map of their travel route. As a MTA Construction & Development Data Specialist, John is concerned about the efficiency and to see if the subway system is meeting goals without bias. The user is drawn to the polylines that represent subway lines and associates line stroke width to efficiency and performance. The user can compare different routes and route combinations to see which is the most efficient across time and space. Hovering over the 4/5/6 line, the user identifies that it has the most riders of any line in the city. The user can then go to a table ranking ridership for that specific day across all lines to see where the 4/5/6 line ranks among others. After comparing the 4/5/6 line and the N/Q/R line, John decides to take the N/Q/R line to minimize his chances of the train being full.


### Requirements Document    

| # |   Representation            |                                                                                                                                                              |
| :------------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | Basemap       | Map of entire New York City area: Street view                                                                                                                |
| 2              | Census tracts | Census tract polygons on top of basemap and below subway/bus data https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page        |
| 3              | Subway        | Location of subway stations (points) and routes (polylines) https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive |
| 4              | Bus           | Location of bus stops (points) and routes (polylines) https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers+Archive       |
| 5              | Temporal Graph  | Shows yearly ridership data for selected route/station, line graph.                                                                                          |
| 6              | Legend        | Describes visual depictions of census tracts, routes, and stops                                                                                              |
| 7              | Context       | Map information alongside guide and context for users                                                                                                        |

| # |    Interaction                |                                                                                                                                                                                                                       |
| :---------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1           | Layer Toggle       | Overlay: Bus, subway, census data (income, family households, etc) layers togglable using check boxes                                                                                                                 |
| 2           | Query Panel        | Search: User inputs census block or address, map highlights and retrieves data. Includes autofill.                                                                                                                    |
| 3           | Slider         | Sequence: Allows user to scroll through data from 2015-2020                                                                                                                                                           |
| 4           | Route & Stop hover | Retrieve: Hover over bus or subway route/stop to get ridership details, list of stops, current stop.                                                                                                                  |
| 5           | Census block hover | Retrieve: Shows census tract ID and data being displayed.                                                                                                                                                             |
| 6           | Census Select      | Retrieve/Resymbolize: When a user selects a census block, it changes color and a graphic pops up on the side that shows the rank of the block, alongside multiple blocks directly above and below it in the rankings. |
| 7           | Transit Select     | Resymbolize: Line graph displays current transit data, with the present map being indicated with a highlighted dot on the graph.                                                                                      |


    
### Wireframes
![wireframe_1](https://user-images.githubusercontent.com/99845984/231393174-3420a1e5-fa88-4ce4-9729-140979cdd671.jpg)
![wireframe_2](https://user-images.githubusercontent.com/99845984/231393787-bddfad93-2d05-4a29-84e6-a552a61d6338.jpg)
![wireframe_3](https://user-images.githubusercontent.com/99845984/231393813-8c366e45-3517-4b5e-8080-dbd520895e33.jpg)

![wireframe 4](https://user-images.githubusercontent.com/117290490/231512169-ac251e91-c0ae-4e92-89d4-dd87e5143535.jpeg)
![wireframe 5](https://user-images.githubusercontent.com/117290490/231512189-272060c2-10fd-4fcd-9935-46170bd058a8.jpeg)
