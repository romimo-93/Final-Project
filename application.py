# import necessary libraries
from flask import (Flask, render_template, jsonify, request, redirect)
import logging
from src import sql_repo
from cluster import cluster

logger = logging.getLogger()
logger.setLevel(logging.INFO)

#################################################
# Flask Setup
#################################################

application = Flask(__name__)

#################################################
# Cached Data
#################################################
seasons = None

#################################################
# Routes
#################################################

# create route that renders index.html template
@application.route("/")
def home():
    return render_template("index.html")

@application.route("/api/data")
def data():
    sql = sql_repo.sql_query("sql_data")
    if (sql != ""):
        results = sql_repo.sql(sql)
    return jsonify(results)


@application.route("/api/seasons")
def seasons():
    global seasons
    if (seasons is None):
        logger.error("[INFO] Setting seasons from query")
        sql = sql_repo.sql_query("sql_seasons")
        if (sql != ""):
            results = sql_repo.sql_list(sql)
            results = seasons = jsonify(results)
    else:
        logger.error("[INFO] Setting seasons from cache")
        results = seasons
    return results


@application.route("/api/playerstats/<season>!<player_id>!<team_id>")
def daterequested(season, player_id, team_id):
    results = {}    
    if ((player_id.isnumeric() == True) and (season.isnumeric() == True) & (team_id.isnumeric() == True)):        
        sql = sql_repo.sql_query("sql_daterequested",season, team_id, player_id)        
        if (sql != ""):
            results = sql_repo.sql(sql)    

    return jsonify(results)

@application.route("/api/playerinfo/<player_id>")
def playerinfo(player_id):
    results = {}    
    sql = sql_repo.sql_query("sql_playerinfo", "", "", player_id)        
    if (sql != ""):
        results = sql_repo.sql(sql)    
    return jsonify(results)

@application.route("/api/players/")
def players():
    results = {}    
    sql = sql_repo.sql_query("sql_players") 
    if (sql != ""):
        results = sql_repo.sql(sql)    
    return jsonify(results)

@application.route("/api/aggplayerstats/<player_id>")
def aggplayerstats(player_id):
    results = {}
    sql = sql_repo.sql_query("sql_aggplayerstats") 
    if (player_id.isnumeric()) == True & (sql != ""):  
        sql += " where player_id = " + player_id
    if (sql != ""):
        results = sql_repo.sql(sql)                
    return jsonify(results)

@application.route("/api/avgplayerstats/<player_id>")
def avgplayerstats(player_id):
    sql = sql_repo.sql_query("sql_avgplayerstats")     
    if (player_id.isnumeric()) == True & (sql != ""):  
        sql += " where player_id = " + player_id
    if (sql != ""):
        results = sql_repo.sql(sql)   
    return jsonify(results)

@application.route("/api/teams")
def teams():
    results = {}  
    sql = sql_repo.sql_query("sql_teams") 
    if (sql != ""):
        results = sql_repo.sql(sql)            
    return jsonify(results)

@application.route("/api/seasonTeamPlayers/<season>/<team_id>")
def seasonTeamPlayers(season, team_id):
    results = {}  
    sql = sql_repo.sql_query("seasonTeamPlayers", season, team_id)     
    if (sql != ""):
        results = sql_repo.sql(sql)   
    return jsonify(results)

@application.route("/api/seasonTeams/<season>")
def seasonTeams(season):
    results = {}
    sql = sql_repo.sql_query("seasonTeams", season)     
    print(sql)
    if (sql != ""):
        results = sql_repo.sql(sql)   
    return jsonify(results)    

#### This route was used to generate the clustering images 
# @application.route("/get/cluster-images")
# def clusterimages():
#     results = sql(f"SELECT * FROM dbo.avgplayerstats")
#     xs = ["assists", "goals", "shots", "blocked", "hits", "penaltyMinutes", "takeaways", "giveaways"]
#     ys = ["timeOnIce", "evenTimeOnIce", "shortHandedTimeOnIce",	"powerPlayTimeOnIce"]
#     for x in xs:
#         for y in ys:
#             cluster_data = []
#             for player in results:
#                 cluster_data.append([player[x],player[y]])
#             cluster(cluster_data, x, y)
#     return redirect("/", 304)

#################################################
# End Routes
#################################################

if __name__ == '__main__':
    application.run(debug=True)
