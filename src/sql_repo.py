import psycopg2
from src import config
from psycopg2 import Error

season = '20142015'
team_id = '4'
player_id = '8468309'

sql_data = "SELECT \"player_id\",\"goals\",\"timeOnIce\",\"penaltyMinutes\" FROM game_skater_stats LIMIT 100;"
sql_seasons = "select distinct season from game order by season desc;"
sql_daterequested = "SELECT distinct \"game\".\"outcome\", team_val(cast(\"game\".\"home_team_id\" as int),'Name') || ' vs ' || team_val(cast(\"away_team_id\" as int),'name') as \"Teams\",\
    game.\"date_time_GMT\", DATE(\"game\".\"date_time_GMT\") as date \
    , game.season, game_skater_stats.game_id, player_id, skater_val(player_id,'Name') as PlayerName, \
    skater_val(player_id,'Position') as \"Position\", team_id, \"timeOnIce\", \"assists\", \"goals\", \"shots\",\"hits\",\"powerPlayGoals\",\"powerPlayAssists\",\"penaltyMinutes\", \
    \"faceOffWins\",\"faceoffTaken\",\"takeaways\",\"giveaways\",\"shortHandedGoals\",\"shortHandedAssists\",\"blocked\",\"plusMinus\",\"evenTimeOnIce\",\"shortHandedTimeOnIce\",\
    \"powerPlayTimeOnIce\" \
    FROM \"game_skater_stats\" \
    left join \"game\" on \"game_skater_stats\".\"game_id\" = \"game\".\"game_id\" where \
    \"season\" = " + str(season) + " \
    and \"team_id\" = " + str(team_id) + "  \
    and \"player_id\" = " + str(player_id) + " \
    order by \"game\".\"date_time_GMT\" desc;"
sql_playerinfo = "SELECT \"player_id\", \"assists\", \"timeOnIce\", \"goals\", \"shots\", \"hits\", \
    \"penaltyMinutes\" from \"game_skater_stats\" where \"player_id\" = " + str(player_id)
sql_players = "select \"player_id\", \"firstName\" || ' ' || \"lastName\" || ' (' || \"primaryPosition\" ||')' as \"PlayerName\" from \"player_info\";"   
sql_aggplayerstats = "select * from dbo.aggplayerstats;"
sql_teams = "select \"team_id\", \"shortName\" || ' ' || \"teamName\" as \"team\" from \"team_info order\" by \"shortName\";"
seasonTeamPlayers = "select \"team_id\", \"teamName\" from \"season_team\" where \"season\" = " + str(season) + " order by \"teamName\";"
seasonTeams = "select \"team_id\", \"teamName\" from \"season_team\" where \"season\" = " + str(season) + " order by \"teamName\";"

def MF_SQL_List(p_SQL):
    try:
        # Connect to an existing database
        connection = psycopg2.connect(user=config.db_user,
                                    password=config.db_password,
                                    host=config.db_host,
                                    port=config.db_port,
                                    database=config.db_name)

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        print("PostgreSQL server information")
        print(connection.get_dsn_parameters(), "\n")
        # Executing a SQL query
        cursor.execute(sql_data)
        # Fetch result
        data = cursor.fetchone()
        print("You are connected to - ", data, "\n")
        
        rows = []
        num_fields = len(cursor.description)
        field_names = [i[0] for i in cursor.description]

        print(num_fields, field_names)
        while data:
            rows.append(data[0])
            data = cursor.fetchone()

        dict = {}
        dict["list"] = rows
        return dict
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

def MF_SQL(p_SQL):
    try:
        # Connect to an existing database
        connection = psycopg2.connect(user=config.db_user,
                                    password=config.db_password,
                                    host=config.db_host,
                                    port=config.db_port,
                                    database=config.db_name)

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        print("PostgreSQL server information")
        print(connection.get_dsn_parameters(), "\n")
        # Executing a SQL query
        cursor.execute(sql_data)
        # Fetch result
        data = cursor.fetchone()
        print("You are connected to - ", data, "\n")
        
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

        print(rows)
        return rows
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
