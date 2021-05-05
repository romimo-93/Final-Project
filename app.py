# import necessary libraries
import os
from flask import (Flask,render_template,jsonify,request,redirect)
from src import config
from bson.json_util import dumps
import json
import requests
import dns
import pyodbc as podbc
from flask_cors import CORS

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

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
    print(num_fields,field_names)
    while data:            
        rows.append(data[0])                                                
        data = cursor.fetchone()
    
    conn.close()
    dict = {}
    dict["list"] = rows
    return dict




# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/data")
def data():
    results = MF_SQL("SELECT top 2000 player_id,goals,timeOnIce,penaltyMinutes FROM game_skater_stats")
    return jsonify(results)    

@app.route("/api/seasons")
def seasons():
    results = MF_SQL_List("select distinct season from game order by season desc")
    return jsonify(results)


@app.route("/api/playerstats/<season>!<player_id>!<limit>")
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


if __name__ == '__main__':    
    app.run(debug=True)
  