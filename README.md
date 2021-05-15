# Final-Project - NHL Player Modeling and Analysis
## NHL Data Set ##
* google Doc: https://docs.google.com/document/d/1yXzmSaR8Q2uJT9VKhv3R9BpfZTpPVWzggpWvTz5DTS4/edit
* https://www.kaggle.com/martinellis/nhl-game-data?select=game.csv (Kaggle)
* https://www.quanthockey.com/nhl/team-game-logs/chicago-blackhawks-2016-17-nhl-game-log.html (QuantHockey)
## Time Line ##
* **Saturday 5/1** --> Each add 1-2 possible datasets to file (All)
*  **Monday 5/3** --> Load Data into Database using Amazon AWS, SQL Server (Ben)
* **Monday 5/3** --> Define categories of players and features we are using to categorize them.
* **Monday 5/3** --> Host AWS website with Flask (Ben)
* **Wednesday 5/5** --> K-means clusters for x(time on ice) and multiple Y(Assists, shots, goals, +-, Block Shots). (Andrew)
* **Wednesday 5/7** --> Categorize players based on K-means clusters. (Andrew)
* **Wednesday 5/7** --> Create Bubble graph with similar x and y as K-means (similar to obesity demographic homework)(Melissa)
* **Wednesday 5/7** --> Drop down for players that shows stats. (Romi)
* **Saturday 5/8** --> Build website with bootstrap template (TBD)
* **Wednesday 5/12** --> Have project complete for final run through
* **Saturday 5/15** --> Final Project Due


## Questions to Answer ##
1. Can a players position be determined based on previous time on how successful they are while on the ice, and what they are successful at?
2. Do players have similarities that can be correlated to a third variable?
3. Can you predict player current primary position based on their past records?

## Goals ## 
* Use predictive algorithm to determine the position a player plays based on K means clustering of time on ice and other features. 
* Provide interactive tools to give insight into player statistics.
* Provide interactive tool to display individual player statistics.

## Website Features ##
1. Plots showing predicted model of what players should play what positions using K-Means clustering. User selection to determine what features they want to use in the model. This is tied to the bubble graph
2. Bubble graph with one x(time on ice) and multiple Y(Assists, shots, goals, +-, Block Shots). 
3. Drop down table with player names for each season and team, that show player stats when chosen.
4. An in depth analysis of the clustering

## Technologies used ##

* Scikit-learn - For clustering data using k-Means method. Utilized both Neural Network and Grid Search CV models.
* Flask - For the web application and interface to Python.
* Amazon AWS - Elastic Beanstalk, RDS, S3, and Route 53 to deploy and operate the full-stack application.
* PostgreSQL - Relational database.

## Training vs Test ##
* Use CSV from Kaggle to train model. Use current Data for this year as Test data to determine what positions players would be most successful in.

## Challenges ##

* **AWS** - It is an amazing infrastructure, with a relatively steep learning curve. We first decided to go with Microsoft SQL Server as the database as several team members have used it in the past and the client side interface is more robust in our opinion. Trouble came from members that did not have a windows based platform. The decision was made to transfer over to PostgreSQL as an OS neutral platform. Figuring out how all the “Lego” blocks of AWS fit together and get working together was a challenge, but once working it made for easy deployment.

## Future Exploration ##
1. Player category/performance over time, comparison year over year 

