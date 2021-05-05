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
    results = MF_SQL("select distinct cast(season as numeric) from game order by cast(season as numeric) desc")
    return jsonify(results)    

if __name__ == '__main__':    
    app.run(debug=True)
  