import psycopg2
from psycopg2 import Error
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if 'RDS_HOSTNAME' in os.environ:
    db_name=os.environ['RDS_DB_NAME']
    db_user=os.environ['RDS_USERNAME']
    db_password=os.environ['RDS_PASSWORD']
    db_host=os.environ['RDS_HOSTNAME']
    db_port= os.environ['RDS_PORT']
else:
    from src import config
    db_user=config.db_user
    db_password=config.db_password
    db_host=config.db_host
    db_port=config.db_port
    db_name=config.db_name

def sql_query(queryname, season = "", team_id = "", player_id = ""):   
    sql = ""

    if (queryname == "sql_data"):
        sql = "SELECT \"player_id\",\"goals\",\"timeOnIce\",\"penaltyMinutes\" FROM game_skater_stats LIMIT 100;"    
    elif (queryname == "sql_seasons"):
        sql = "select distinct season from game order by season desc;"
    elif (queryname == "sql_daterequested") & (season != "") & (team_id != "") & (player_id != ""):
        sql = "SELECT distinct \"game\".\"outcome\", team_val(cast(\"game\".\"home_team_id\" as int),'Name') || ' vs ' || team_val(cast(\"away_team_id\" as int),'Name') as \"Teams\",\
                game.\"date_time_GMT\", DATE(\"game\".\"date_time_GMT\") as date \
                , game.season, game_skater_stats.game_id, player_id, skater_val(player_id,'Name') as PlayerName, \
                skater_val(player_id,'Position') as \"Position\", team_id, \"timeOnIce\", \"assists\", \"goals\", \"shots\",\"hits\",\"powerPlayGoals\",\"powerPlayAssists\",\"penaltyMinutes\", \
                \"faceOffWins\",\"faceoffTaken\",\"takeaways\",\"giveaways\",\"shortHandedGoals\",\"shortHandedAssists\",\"blocked\",\"plusMinus\",\"evenTimeOnIce\",\"shortHandedTimeOnIce\",\
                \"powerPlayTimeOnIce\" \
                FROM \"game_skater_stats\" \
                left join \"game\" on \"game_skater_stats\".\"game_id\" = \"game\".\"game_id\" where \
                \"season\"::int=" + str(season) + " \
                and \"team_id\" = " + str(team_id) + "  \
                and \"player_id\" = " + str(player_id) + " \
                order by \"game\".\"date_time_GMT\" desc;"
    elif (queryname == "sql_playerinfo") & (player_id != ""):
        sql = "SELECT *,skater_val(player_id,'PredictedPosition_nn') as PredictedPosition_nn, skater_val(player_id,'PredictedPosition_grid') as PredictedPosition_grid, cast(age(cast(\"birthDate\" as timestamp)) as varchar(100)) as age from \"player_info\" where \"player_id\" = " + str(player_id)
    elif (queryname == "sql_players"):
        sql = "select \"player_id\", \"firstName\" || ' ' || \"lastName\" || ' (' || \"primaryPosition\" ||')' as \"PlayerName\" from \"player_info\";"   
    elif (queryname == "sql_aggplayerstats"):
        sql = "select * from aggplayerstats "
    elif (queryname == "sql_avgplayerstats"):
        sql = "select * from avgplayerstats " 
    elif (queryname == "sql_avgplayerpred"):
        sql = "select * from player_predictions "        
    elif (queryname == "sql_teams"):
        sql = "select \"team_id\", \"shortName\" || ' ' || \"teamName\" as \"team\" from \"team_info\" order by \"shortName\";"
    elif (queryname == "seasonTeamPlayers") & (season != "") & (team_id != ""):        
        sql = "select distinct player_id,skater_Val(player_id, 'NameSort') AS PlayerName from game_skater_stats where team_id = " + str(team_id) + " and game_id in (select game_id from game where \"season\"::int=" + str(season) + ");"
    elif (queryname == "seasonTeams") & (season != ""):        
        sql = "select \"team_id\", \"teamName\" from \"season_team\" where \"season\"::int=" + str(season) + " order by \"teamName\";"

    return sql


def sql_list(sql_stmt):
    connection = None
    try:
        # Connect to an existing database
        connection = psycopg2.connect(user=db_user,
                                    password=db_password,
                                    host=db_host,
                                    port=db_port,
                                    database=db_name)

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        logger.info("PostgreSQL server information")
        logger.info(connection.get_dsn_parameters(), "\n")
        # Executing a SQL query
        cursor.execute(sql_stmt)
        # Fetch result
        data = cursor.fetchone()
        logger.info("You are connected to - ", data, "\n")
        
        rows = []
        num_fields = len(cursor.description)
        field_names = [i[0] for i in cursor.description]

        logger.info(num_fields, field_names)
        while data:
            rows.append(data[0])
            data = cursor.fetchone()

        rows_dict = {}
        rows_dict["list"] = rows
        return rows_dict
    except (Exception, Error) as error:
        logger.error("Error while connecting to PostgreSQL " + str(error))
    finally:
        if (connection is not None):
            cursor.close()
            connection.close()
            logger.error("PostgreSQL connection is closed")

def sql(sql_stmt):
    connection = None
    try:
        # Connect to an existing database
        connection = psycopg2.connect(user=db_user,
                                    password=db_password,
                                    host=db_host,
                                    port=db_port,
                                    database=db_name)

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        logger.info("PostgreSQL server information")
        logger.info(connection.get_dsn_parameters())
        # Executing a SQL query
        cursor.execute(sql_stmt)
        # Fetch result
        data = cursor.fetchone()
        logger.info("You are connected to - " + str(data))
        
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

        # logger.info(rows)
        return rows
    except (Exception, Error) as error:
        logger.error("Error while connecting to PostgreSQL " + str(error) + ". Failed to run " + str(sql_stmt))
    finally:
        if (connection is not None):
            cursor.close()
            connection.close()
            logger.info("PostgreSQL connection is closed")
