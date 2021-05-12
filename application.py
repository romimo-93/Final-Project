# import necessary libraries
from flask import (Flask, render_template, jsonify, request, redirect)
from src import config, sql_repo
import json
import requests
import pyodbc as podbc
from cluster import cluster


#################################################
# Flask Setup
#################################################
application = Flask(__name__)
# CORS(application)

#################################################
# Database Setup
#################################################


def MF_SQL(p_SQL):
    conn = podbc.connect(config.sql_conn)
    cursor = conn.cursor()
    cursor.execute(p_SQL)
    data = cursor.fetchone()
    rows = []
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]

    while data:
        # print(data)
        row_dict = {}
        for i in range(num_fields):
            row_dict[field_names[i]] = data[i]

        # print(row_dict)
        rows.append(row_dict)
        data = cursor.fetchone()

    conn.close()
    return rows


def MF_SQL_List(p_SQL):
    conn = podbc.connect(config.sql_conn)
    cursor = conn.cursor()
    cursor.execute(p_SQL)
    data = cursor.fetchone()
    rows = []
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]
    print(num_fields, field_names)
    while data:
        rows.append(data[0])
        data = cursor.fetchone()

    conn.close()
    dict = {}
    dict["list"] = rows

    return dict

#################################################
# Routes
#################################################

# create route that renders index.html template
@application.route("/")
def home():
    return render_template("index.html")


@application.route("/api/data")
def data():
    results = sql_repo.MF_SQL(sql_repo.sql_data)
    return jsonify(results)


@application.route("/api/seasons")
def seasons():
    results = sql_repo.MF_SQL_List(sql_repo.sql_seasons)
    return jsonify(results)


# @application.route("/api/playerstats/<season>!<player_id>!<team_id>")
# def daterequested(season, player_id, team_id):
#     results = {}    

#     if ((player_id.isnumeric() == True) and (season.isnumeric() == True) & (team_id.isnumeric() == True)):
#         sql = "SELECT distinct game.outcome,dbo.team_val(home_team_id,'name') + ' vs '+ dbo.team_val(away_team_id,'name') as Teams, game.date_time_GMT, CONVERT(VARCHAR, DATEADD(hour,DATEDIFF (hour, GETUTCDATE(), GETDATE()),game.date_time_GMT),101) as date, game.season, game_skater_stats.game_id, player_id, dbo.skater_val(player_id,'Name') as PlayerName, dbo.skater_val(player_id,'Position') as Position, team_id, timeOnIce, assists, goals, shots,hits,powerPlayGoals,powerPlayAssists,penaltyMinutes, faceOffWins,faceoffTaken,takeaways,giveaways,shortHandedGoals,shortHandedAssists,blocked,plusMinus,evenTimeOnIce,shortHandedTimeOnIce,powerPlayTimeOnIce FROM game_skater_stats left join game on game_skater_stats.game_id = game.game_id where season = " + season + " and team_id = " + team_id + " and player_id = " + player_id + " order by game.date_time_GMT desc"        
#         results = MF_SQL(sql)    

#      return jsonify(results)

# @application.route("/api/playerinfo/<player_id>")
# def playerinfo(player_id):
#     results = {}
#     results = MF_SQL(
#         "SELECT player_id, assists, timeOnIce, goals, shots, hits, penaltyMinutes from game_skater_stats where player_id = " + str(player_id))
#     return jsonify(results)


# @application.route("/api/players/")
# def players():
#     results = {}
#     results = MF_SQL(
#         "select player_id, firstName + ' ' + lastName + ' (' + primaryPosition +')' as PlayerName from player_info")
#     return jsonify(results)


# @application.route("/api/aggplayerstats/<player_id>")
# def aggplayerstats(player_id):
#     sql = "select * from dbo.aggplayerstats"
#     if player_id.isnumeric() == True:  
#         sql += " where player_id = " + player_id
#     results = MF_SQL(sql)
#     return jsonify(results)

# @application.route("/api/avgplayerstats/<player_id>")
# def avgplayerstats(player_id):
#     sql = "select * from dbo.avgplayerstats"
    
#     if player_id.isnumeric() == True:  
#         sql += " where player_id = " + player_id
        
#     results = MF_SQL(sql)
#     return jsonify(results)


# @application.route("/api/teams")
# def teams():
#     sql = "select team_id, shortName + ' ' + teamName as team from team_info order by shortName"
#     results = MF_SQL(sql)
#     return jsonify(results)

# @application.route("/api/seasonTeamPlayers/<season>/<team_id>")
# def seasonTeamPlayers(season, team_id):
#     sql = "select distinct player_id,dbo.skater_Val(player_id, 'NameSort') AS PlayerName from game_skater_stats where team_id = " + team_id + " and game_id in (select game_id from game where season = " + season + ")"
#     results = MF_SQL(sql)
#     return jsonify(results)

# @application.route("/api/seasonTeams/<season>")
# def seasonTeams(season):
#     sql = "select team_id, teamName from season_team where season = " + season + " order by teamName"
#     results = MF_SQL(sql)
#     return jsonify(results)

#### This route was used to generate the clustering images 
# @application.route("/get/cluster-images")
# def clusterimages():
#     results = MF_SQL(f"SELECT * FROM dbo.avgplayerstats")
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
