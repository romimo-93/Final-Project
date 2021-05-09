# import necessary libraries
from flask import (Flask, render_template, jsonify, request, redirect)
from src import config
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

def clusterData(xaxis, yaxis):
    results = MF_SQL(f"SELECT * FROM dbo.avgplayerstats")
    cluster_data = []
    for player in results:
        cluster_data.append([player[xaxis],player[yaxis]])
    fig = cluster(cluster_data, xaxis, yaxis)
    return fig

# create route that renders index.html template
@application.route("/")
def home():
    fig = clusterData("shots", "goals")
    return render_template("index.html", fig=fig)


@application.route("/api/data")
def data():
    results = MF_SQL(
    "SELECT top 100 player_id,goals,timeOnIce,penaltyMinutes FROM game_skater_stats")
    return jsonify(results)


@application.route("/api/seasons")
def seasons():
    results = MF_SQL_List("select distinct season from game order by season desc")
    return jsonify(results)


@application.route("/api/playerstats/<season>!<player_id>!<limit>")
def daterequested(season, player_id, limit):
    season_int = 20192020
    limit_int = 100
    try:
        season_int = int(season)
        limit_int = int(limit)
    except ValueError:
        # Handle the exception
        "Invalid Year"
    results = {}

    limit_string = ""
    if limit_int > 0:
        limit_string = "TOP " + str(limit_int) + " "

    if season_int > 0:
        results = MF_SQL("SELECT " + limit_string + " game.season, game_skater_stats.game_id, player_id, dbo.skater_val(player_id,'Name') as PlayerName, dbo.skater_val(player_id,'Position') as Position, team_id, timeOnIce, assists, goals, shots,hits,powerPlayGoals,powerPlayAssists,penaltyMinutes, faceOffWins,faceoffTaken,takeaways,giveaways,shortHandedGoals,shortHandedAssists,blocked,plusMinus,evenTimeOnIce,shortHandedTimeOnIce,powerPlayTimeOnIce FROM game_skater_stats left join game on game_skater_stats.game_id = game.game_id where season = " + str(season_int))

    return jsonify(results)

@application.route("/api/playerinfo/<player_id>")
def playerinfo(player_id):
    results = {}
    results = MF_SQL(
        "SELECT player_id, assists, timeOnIce, goals, shots, hits, penaltyMinutes from game_skater_stats where player_id = " + str(player_id))
    return jsonify(results)


@application.route("/api/players/")
def players():
    results = {}
    results = MF_SQL(
        "select player_id, firstName + ' ' + lastName + ' (' + primaryPosition +')' as PlayerName from player_info")
    return jsonify(results)


@application.route("/api/aggplayerstats/<player_id>")
def aggplayerstats(player_id):
    sql = "select * from dbo.aggplayerstats"
    if player_id.isnumeric() == True:  
        sql += " where player_id = " + player_id
    results = MF_SQL(sql)
    return jsonify(results)

@application.route("/api/avgplayerstats/<player_id>")
def avgplayerstats(player_id):
    sql = "select * from dbo.avgplayerstats"
    
    if player_id.isnumeric() == True:  
        sql += " where player_id = " + player_id
        
    results = MF_SQL(sql)
    return jsonify(results)


@application.route("/api/teams")
def teams():
    sql = "select team_id, shortName + ' ' + teamName as team from team_info order by shortName"
    results = MF_SQL(sql)
    return jsonify(results)

@application.route("/api/seasonTeamPlayers/<season>/<team_id>")
def seasonTeamPlayers(season, team_id):
    sql = "select distinct player_id,dbo.skater_Val(player_id, 'NameSort') AS PlayerName from game_skater_stats where team_id = " + team_id + " and game_id in (select game_id from game where season = " + season + ")"
    results = MF_SQL(sql)
    return jsonify(results)

@application.route("/api/seasonTeams/<season>")
def seasonTeams(season):
    sql = "select team_id, teamName from season_team where season = " + season + " order by teamName"
    results = MF_SQL(sql)
    return jsonify(results)
    

if __name__ == '__main__':
    application.run(debug=True)
