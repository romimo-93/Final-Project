# Final-Project - NHL Player Modeling and Analysis
## NHL Data Set ##
* google Doc: https://docs.google.com/document/d/1yXzmSaR8Q2uJT9VKhv3R9BpfZTpPVWzggpWvTz5DTS4/edit
* https://www.kaggle.com/martinellis/nhl-game-data?select=game.csv (Kaggle)
* https://www.quanthockey.com/nhl/team-game-logs/chicago-blackhawks-2016-17-nhl-game-log.html (QuantHockey)

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

## Analysis ##
1. **Dabbler** - There is a fairly significant distinction between forwards and defensemen when it comes to both the shots and goals recorded. Using all available game data since the 2000-2001 season, we can see that forwards outshoot (bottom-left) and outscore (top-left) defensemen. Inversely, we can see that defensemen block more shots than forwards (below).
2. **Model Accuracy** - The two models created use all available player stats to predict the player’s position. The Neural Network and the Grid Search CV both pedict a player’s position at about 85% accuracy. When diving into the accuracy more, we found that the Neural Network was able to predict with an accuracy of 97.5% whether a player was a Defenseman or not -- Grid Search model is 94% accurate for Defensemen. On the other side of the ice, we categorized Forwards into Centers and Wingers. Since these positions are typically more offense-oriented, it was a little more difficult to train the model, however, both the Neural Network and Grid Search operate at about 82% accuracy.
3. **Where The Machines Failed** - Of the 3353 players tested by the two models, only 12 player positions were guessed incorrectly by both models and neither model matched the other. Interestingly, in all 12 of these instances the player is a Center. Although the occurrence of both models being incorrect is plausible given that neither model is perfect, it seems highly unlikely that all of the players in this instance would be of the same position. If it not completely by chance, then there is a hockey-related explanation. Depending on the team's play style, Centers are sometimes relied on to play two-way hockey (offense and defense). For this reason, there is a real-life factor that explains this perceived phenomena.

## Challenges ##

* **AWS** - It is an amazing infrastructure, with a relatively steep learning curve. We first decided to go with Microsoft SQL Server as the database as several team members have used it in the past and the client side interface is more robust in our opinion. Trouble came from members that did not have a windows based platform. The decision was made to transfer over to PostgreSQL as an OS neutral platform. Figuring out how all the “Lego” blocks of AWS fit together and get working together was a challenge, but once working it made for easy deployment.


## Future Exploration ##
1. Player category/performance over time, comparison year over year.
2. Player positions over time compared to predicted model.
3. Tableau exploration for deeper analysis utilizing different features. Ability to remove features to see if model accuracy changes.

