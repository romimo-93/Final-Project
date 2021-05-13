--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 13.1

-- Started on 2021-05-12 18:23:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 230 (class 1255 OID 16775)
-- Name: skater_val(numeric, character varying); Type: FUNCTION; Schema: public; Owner: administrator
--

CREATE FUNCTION public.skater_val(v_player_id numeric, v_field character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
   return_val varchar(500);
begin
	if (v_field = 'Name') then
		select coalesce("player_info"."firstName",'') || ' ' || coalesce("player_info"."lastName",'') || ' (' || coalesce("player_info"."primaryPosition",'') || ')' into return_val from player_info where player_info.player_id = v_player_id;
	elsif (v_field = 'NameSort') then
		select coalesce("player_info"."lastName",'') || ', ' || coalesce("player_info"."firstName",'') || ' (' || coalesce("player_info"."primaryPosition",'') || ')' into return_val from player_info where player_info.player_id = v_player_id;
	elsif (v_field = 'Position') then
		select coalesce("player_info"."primaryPosition",'') into return_val from player_info where player_info.player_id = v_player_id;
	else
		return_val := 'ERROR';
	end if;
	
	return return_val;
end;
$$;


ALTER FUNCTION public.skater_val(v_player_id numeric, v_field character varying) OWNER TO administrator;

--
-- TOC entry 229 (class 1255 OID 16774)
-- Name: team_val(numeric, character varying); Type: FUNCTION; Schema: public; Owner: administrator
--

CREATE FUNCTION public.team_val(v_team_id numeric, v_field character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
   return_val varchar(500);
begin
	if (v_field = 'Name') then
		select coalesce("team_info"."shortName",'') || ' ' || coalesce("team_info"."teamName",'') into return_val from team_info where team_info.team_id = v_team_id;
	else 
		return_val = 'ERROR';
	end if;
	
	return return_val;
end;
$$;


ALTER FUNCTION public.team_val(v_team_id numeric, v_field character varying) OWNER TO administrator;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16755)
-- Name: game_skater_stats; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_skater_stats (
    game_id integer,
    player_id integer,
    team_id integer,
    "timeOnIce" integer,
    assists integer,
    goals integer,
    shots integer,
    hits integer,
    "powerPlayGoals" integer,
    "powerPlayAssists" integer,
    "penaltyMinutes" integer,
    "faceOffWins" integer,
    "faceoffTaken" integer,
    takeaways integer,
    giveaways integer,
    "shortHandedGoals" integer,
    "shortHandedAssists" integer,
    blocked integer,
    "plusMinus" integer,
    "evenTimeOnIce" integer,
    "shortHandedTimeOnIce" integer,
    "powerPlayTimeOnIce" integer
);


ALTER TABLE public.game_skater_stats OWNER TO administrator;

--
-- TOC entry 215 (class 1259 OID 16776)
-- Name: aggplayerstats; Type: VIEW; Schema: public; Owner: administrator
--

CREATE VIEW public.aggplayerstats AS
 SELECT game_skater_stats.player_id,
    public.skater_val((game_skater_stats.player_id)::numeric, 'Name'::character varying) AS "PlayerName",
    public.skater_val((game_skater_stats.player_id)::numeric, 'Position'::character varying) AS "position",
    sum(game_skater_stats.goals) AS goals,
    sum(game_skater_stats.assists) AS assists,
    sum(game_skater_stats.hits) AS hits,
    sum(game_skater_stats."powerPlayGoals") AS powerplaygoals,
    sum(game_skater_stats."powerPlayAssists") AS "powerPlayAssists",
    sum(game_skater_stats."penaltyMinutes") AS "penaltyMinutes",
    sum(game_skater_stats."faceOffWins") AS faceoffwins,
    sum(game_skater_stats."faceoffTaken") AS "faceoffTaken",
    sum(game_skater_stats.takeaways) AS takeaways,
    sum(game_skater_stats.giveaways) AS giveaways,
    sum(game_skater_stats."shortHandedGoals") AS "shortHandedGoals",
    sum(game_skater_stats."shortHandedAssists") AS "shortHandedAssists",
    sum(game_skater_stats.blocked) AS blocked,
    sum(game_skater_stats."plusMinus") AS "plusMinus",
    (sum(game_skater_stats."evenTimeOnIce") / 60) AS "evenTimeOnIce",
    (sum(game_skater_stats."shortHandedTimeOnIce") / 60) AS "shortHandedTimeOnIce",
    (sum(game_skater_stats."powerPlayTimeOnIce") / 60) AS "powerPlayTimeOnIce",
    (sum(game_skater_stats."timeOnIce") / 60) AS "timeOnIce",
    sum(game_skater_stats.shots) AS shots
   FROM public.game_skater_stats
  GROUP BY game_skater_stats.player_id;


ALTER TABLE public.aggplayerstats OWNER TO administrator;

--
-- TOC entry 216 (class 1259 OID 16781)
-- Name: avgplayerstats; Type: VIEW; Schema: public; Owner: administrator
--

CREATE VIEW public.avgplayerstats AS
 SELECT game_skater_stats.player_id,
    public.skater_val((game_skater_stats.player_id)::numeric, 'Name'::character varying) AS "PlayerName",
    public.skater_val((game_skater_stats.player_id)::numeric, 'Position'::character varying) AS "Position",
    avg((game_skater_stats."timeOnIce")::double precision) AS "timeOnIce",
    avg((game_skater_stats.assists)::double precision) AS assists,
    avg((game_skater_stats.goals)::double precision) AS goals,
    avg((game_skater_stats.shots)::double precision) AS shots,
    avg((game_skater_stats.hits)::double precision) AS hits,
    avg((game_skater_stats.goals)::double precision) AS "Expr1",
    avg((game_skater_stats."powerPlayGoals")::double precision) AS "powerPlayGoals",
    avg((game_skater_stats."powerPlayAssists")::double precision) AS "powerPlayAssists",
    avg((game_skater_stats."penaltyMinutes")::double precision) AS "penaltyMinutes",
    avg((game_skater_stats."faceOffWins")::double precision) AS "faceOffWins",
    avg((game_skater_stats."faceoffTaken")::double precision) AS "faceoffTaken",
    avg((game_skater_stats.takeaways)::double precision) AS takeaways,
    avg((game_skater_stats."shortHandedGoals")::double precision) AS "shortHandedGoals",
    avg((game_skater_stats."shortHandedAssists")::double precision) AS "shortHandedAssists",
    avg((game_skater_stats.blocked)::double precision) AS blocked,
    avg((game_skater_stats."plusMinus")::double precision) AS "plusMinus",
    avg((game_skater_stats."evenTimeOnIce")::double precision) AS "evenTimeOnIce",
    avg((game_skater_stats."shortHandedTimeOnIce")::double precision) AS "shortHandedTimeOnIce",
    avg((game_skater_stats."powerPlayTimeOnIce")::double precision) AS "powerPlayTimeOnIce"
   FROM public.game_skater_stats
  GROUP BY game_skater_stats.player_id;


ALTER TABLE public.avgplayerstats OWNER TO administrator;

--
-- TOC entry 212 (class 1259 OID 16718)
-- Name: game; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game (
    game_id integer NOT NULL,
    season character varying,
    type character varying,
    "date_time_GMT" character varying,
    away_team_id character varying,
    home_team_id character varying,
    away_goals character varying,
    home_goals character varying,
    outcome character varying,
    home_rink_side_start character varying,
    venue character varying,
    venue_link character varying,
    venue_time_zone_id character varying,
    venue_time_zone_offset character varying,
    venue_time_zone_tz character varying
);


ALTER TABLE public.game OWNER TO administrator;

--
-- TOC entry 206 (class 1259 OID 16671)
-- Name: game_goalie_stats; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_goalie_stats (
    game_id integer,
    player_id integer,
    team_id integer,
    "timeOnIce" integer,
    assists integer,
    goals integer,
    pim integer,
    shots integer,
    saves integer,
    "powerPlaySaves" integer,
    "shortHandedSaves" integer,
    "evenSaves" integer,
    "shortHandedShotsAgainst" integer,
    "evenShotsAgainst" integer,
    "powerPlayShotsAgainst" integer,
    decision character varying,
    "savePercentage" double precision,
    "powerPlaySavePercentage" double precision,
    "evenStrengthSavePercentage" double precision
);


ALTER TABLE public.game_goalie_stats OWNER TO administrator;

--
-- TOC entry 207 (class 1259 OID 16677)
-- Name: game_goals; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_goals (
    play_id character varying,
    strength character varying,
    "gameWinningGoal" character varying,
    "emptyNet" character varying
);


ALTER TABLE public.game_goals OWNER TO administrator;

--
-- TOC entry 208 (class 1259 OID 16683)
-- Name: game_officials; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_officials (
    game_id integer,
    official_name character varying,
    official_type character varying
);


ALTER TABLE public.game_officials OWNER TO administrator;

--
-- TOC entry 209 (class 1259 OID 16689)
-- Name: game_penalties; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_penalties (
    play_id character varying,
    "penaltySeverity" character varying,
    "penaltyMinutes" integer
);


ALTER TABLE public.game_penalties OWNER TO administrator;

--
-- TOC entry 213 (class 1259 OID 16733)
-- Name: game_plays; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_plays (
    play_id character varying NOT NULL,
    game_id integer,
    team_id_for character varying,
    team_id_against character varying,
    event character varying,
    "secondaryType" character varying,
    x character varying,
    y character varying,
    period character varying,
    "periodType" character varying,
    "periodTime" character varying,
    "periodTimeRemaining" character varying,
    "dateTime" character varying,
    goals_away character varying,
    goals_home character varying,
    description character varying,
    st_x character varying,
    st_y character varying
);


ALTER TABLE public.game_plays OWNER TO administrator;

--
-- TOC entry 210 (class 1259 OID 16703)
-- Name: game_plays_players; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_plays_players (
    play_id character varying,
    game_id integer,
    player_id integer,
    "playerType" character varying
);


ALTER TABLE public.game_plays_players OWNER TO administrator;

--
-- TOC entry 211 (class 1259 OID 16709)
-- Name: game_scratches; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_scratches (
    game_id integer,
    team_id integer,
    player_id integer
);


ALTER TABLE public.game_scratches OWNER TO administrator;

--
-- TOC entry 204 (class 1259 OID 16654)
-- Name: game_teams_stats; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.game_teams_stats (
    game_id integer,
    team_id integer,
    "HoA" character varying,
    won bit(1),
    settled_in character varying,
    head_coach character varying,
    goals integer,
    shots integer,
    hits integer,
    pim integer,
    "powerPlayOpportunities" integer,
    "powerPlayGoals" integer,
    "faceOffWinPercentage" double precision,
    giveaways integer,
    takeaways integer,
    blocked integer,
    "startRinkSide" character varying
);


ALTER TABLE public.game_teams_stats OWNER TO administrator;

--
-- TOC entry 202 (class 1259 OID 16638)
-- Name: player_info; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.player_info (
    player_id integer NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    nationality character varying,
    "birthCity" character varying,
    "primaryPosition" character varying,
    "birthDate" character varying,
    "birthStateProvince" character varying,
    height character varying,
    height_cm character varying,
    weight character varying,
    "shootsCatches" character varying
);


ALTER TABLE public.player_info OWNER TO administrator;

--
-- TOC entry 205 (class 1259 OID 16660)
-- Name: season_team; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.season_team (
    team_id integer,
    season integer,
    "teamName" character varying(100)
);


ALTER TABLE public.season_team OWNER TO administrator;

--
-- TOC entry 203 (class 1259 OID 16646)
-- Name: team_info; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.team_info (
    team_id integer NOT NULL,
    "franchiseId" integer,
    "shortName" character varying,
    "teamName" character varying,
    abbreviation character varying,
    link character varying
);


ALTER TABLE public.team_info OWNER TO administrator;

--
-- TOC entry 3754 (class 2606 OID 16725)
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (game_id);


--
-- TOC entry 3756 (class 2606 OID 16740)
-- Name: game_plays game_plays_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.game_plays
    ADD CONSTRAINT game_plays_pkey PRIMARY KEY (play_id);


--
-- TOC entry 3750 (class 2606 OID 16645)
-- Name: player_info player_info_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.player_info
    ADD CONSTRAINT player_info_pkey PRIMARY KEY (player_id);


--
-- TOC entry 3752 (class 2606 OID 16653)
-- Name: team_info team_info_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.team_info
    ADD CONSTRAINT team_info_pkey PRIMARY KEY (team_id);


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: administrator
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO administrator;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2021-05-12 18:23:40

--
-- PostgreSQL database dump complete
--

