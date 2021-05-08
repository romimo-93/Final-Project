USE [nhl_db]
GO
/****** Object:  UserDefinedFunction [dbo].[skater_Val]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[skater_Val](@player_id numeric, @field varchar(50))
RETURNS varchar(500)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @RETURNVALUE varchar(500)

	if (@field = 'Name')
		select @RETURNVALUE = isnull(firstName,'') + ' ' + isnull(lastName,'') + ' (' + isnull(primaryPosition,'') + ')' from player_info where player_id = @player_id
	else if (@field = 'Position')
		select @RETURNVALUE = isnull(primaryPosition,'') from player_info where player_id = @player_id

	RETURN @RETURNVALUE

END
GO
/****** Object:  Table [dbo].[player_info]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[player_info](
	[player_id] [int] NOT NULL,
	[firstName] [nvarchar](50) NOT NULL,
	[lastName] [nvarchar](50) NOT NULL,
	[nationality] [nvarchar](50) NULL,
	[birthCity] [nvarchar](50) NULL,
	[primaryPosition] [nchar](2) NULL,
	[birthDate] [datetime] NULL,
	[birthStateProvince] [nchar](2) NULL,
	[height_cm] [float] NULL,
	[weight] [int] NULL,
	[shootsCatches] [nvarchar](2) NULL,
    CONSTRAINT PK_player_info PRIMARY KEY CLUSTERED (player_id)
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[team_info]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[team_info](
	[team_id] [int] NOT NULL,
	[franchiseId] [int] NOT NULL,
	[shortName] [nvarchar](50) NOT NULL,
	[teamName] [nvarchar](50) NOT NULL,
	[abbreviation] [nvarchar](3) NOT NULL,
	[link] [nvarchar](50) NULL,
    CONSTRAINT PK_team_info PRIMARY KEY CLUSTERED (team_id)
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_skater_stats]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_skater_stats](
	[game_id] [int] NULL,
	[player_id] [int] NULL,
	[team_id] [int] NULL,
	[timeOnIce] [int] NULL,
	[assists] [int] NULL,
	[goals] [int] NULL,
	[shots] [int] NULL,
	[hits] [int] NULL,
	[powerPlayGoals] [int] NULL,
	[powerPlayAssists] [int] NULL,
	[penaltyMinutes] [int] NULL,
	[faceOffWins] [int] NULL,
	[faceoffTaken] [int] NULL,
	[takeaways] [int] NULL,
	[giveaways] [int] NULL,
	[shortHandedGoals] [int] NULL,
	[shortHandedAssists] [int] NULL,
	[blocked] [int] NULL,
	[plusMinus] [int] NULL,
	[evenTimeOnIce] [int] NULL,
	[shortHandedTimeOnIce] [int] NULL,
	[powerPlayTimeOnIce] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[aggplayerstats]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[aggplayerstats]
AS
SELECT        player_id, dbo.skater_Val(player_id, 'Name') AS PlayerName, dbo.skater_Val(player_id, 'Position') AS Position, SUM(goals) AS goals, SUM(assists) AS assists, SUM(hits) AS hits, SUM(powerPlayGoals) AS powerplaygoals, 
                         SUM(powerPlayAssists) AS powerPlayAssists, SUM(penaltyMinutes) AS penaltyMinutes, SUM(faceOffWins) AS faceOffWins, SUM(faceoffTaken) AS faceoffTaken, SUM(takeaways) AS takeaways, SUM(giveaways) AS giveaways, 
                         SUM(shortHandedGoals) AS shortHandedGoals, SUM(shortHandedAssists) AS shortHandedAssists, SUM(blocked) AS blocked, SUM(plusMinus) AS plusMinus, SUM(evenTimeOnIce) / 60 AS evenTimeOnIce, 
                         SUM(shortHandedTimeOnIce) / 60 AS shortHandedTimeOnIce, SUM(powerPlayTimeOnIce) / 60 AS powerPlayTimeOnIce, SUM(timeOnIce) / 60 AS timeOnIce, SUM(shots) AS shots
FROM            dbo.game_skater_stats
GROUP BY player_id
GO
/****** Object:  View [dbo].[avgplayerstats]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[avgplayerstats]
AS
SELECT        player_id, dbo.skater_Val(player_id, 'Name') AS PlayerName, dbo.skater_Val(player_id, 'Position') AS Position, AVG(CAST(goals AS float)) AS goals, AVG(CAST(assists AS float)) AS assists, AVG(CAST(hits AS float)) AS hits, 
                         AVG(CAST(powerPlayGoals AS float)) AS powerplaygoals, AVG(CAST(powerPlayAssists AS float)) AS powerPlayAssists, AVG(CAST(penaltyMinutes AS float)) AS penaltyMinutes, AVG(CAST(faceOffWins AS float)) AS faceOffWins, 
                         AVG(CAST(faceoffTaken AS float)) AS faceoffTaken, AVG(CAST(takeaways AS float)) AS takeaways, AVG(CAST(giveaways AS float)) AS giveaways, AVG(CAST(shortHandedGoals AS float)) AS shortHandedGoals, 
                         AVG(CAST(shortHandedAssists AS float)) AS shortHandedAssists, AVG(CAST(blocked AS float)) AS blocked, AVG(CAST(plusMinus AS float)) AS plusMinus, AVG(CAST(evenTimeOnIce AS float)) / 60 AS evenTimeOnIce, 
                         AVG(CAST(shortHandedTimeOnIce AS float)) / 60 AS shortHandedTimeOnIce, AVG(CAST(powerPlayTimeOnIce AS float)) / 60 AS powerPlayTimeOnIce, AVG(CAST(timeOnIce AS float)) / 60 AS timeOnIce, AVG(CAST(shots AS float)) 
                         AS shots
FROM            dbo.game_skater_stats
GROUP BY player_id
GO
/****** Object:  Table [dbo].[game]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game](
	[game_id] [int] NOT NULL,
	[season] [int] NULL,
	[type] [nvarchar](max) NULL,
	[date_time_GMT] [nvarchar](max) NULL,
	[away_team_id] [int] NULL,
	[home_team_id] [int] NULL,
	[away_goals] [int] NULL,
	[home_goals] [int] NULL,
	[outcome] [nvarchar](max) NULL,
	[home_rink_side_start] [nvarchar](max) NULL,
	[venue] [nvarchar](max) NULL,
	[venue_link] [nvarchar](max) NULL,
	[venue_time_zone_id] [nvarchar](max) NULL,
	[venue_time_zone_offset] [int] NULL,
	[venue_time_zone_tz] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_goalie_stats]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_goalie_stats](
	[game_id] [int] NULL,
	[player_id] [int] NULL,
	[team_id] [int] NULL,
	[timeOnIce] [int] NULL,
	[assists] [int] NULL,
	[goals] [int] NULL,
	[pim] [int] NULL,
	[shots] [int] NULL,
	[saves] [int] NULL,
	[powerPlaySaves] [int] NULL,
	[shortHandedSaves] [int] NULL,
	[evenSaves] [int] NULL,
	[shortHandedShotsAgainst] [int] NULL,
	[evenShotsAgainst] [int] NULL,
	[powerPlayShotsAgainst] [int] NULL,
	[decision] [nvarchar](max) NULL,
	[savePercentage] [nvarchar](max) NULL,
	[powerPlaySavePercentage] [nvarchar](max) NULL,
	[evenStrengthSavePercentage] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_goals]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_goals](
	[play_id] [nvarchar](max) NULL,
	[strength] [nvarchar](max) NULL,
	[gameWinningGoal] [nvarchar](max) NULL,
	[emptyNet] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_officials]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_officials](
	[game_id] [int] NULL,
	[official_name] [nvarchar](max) NULL,
	[official_type] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_penalties]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_penalties](
	[play_id] [nvarchar](max) NULL,
	[penaltySeverity] [nvarchar](max) NULL,
	[penaltyMinutes] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_plays]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_plays](
	[play_id] [nvarchar](max) NULL,
	[game_id] [int] NULL,
	[team_id_for] [nvarchar](max) NULL,
	[team_id_against] [nvarchar](max) NULL,
	[event] [nvarchar](max) NULL,
	[secondaryType] [nvarchar](max) NULL,
	[x] [nvarchar](max) NULL,
	[y] [nvarchar](max) NULL,
	[period] [int] NULL,
	[periodType] [nvarchar](max) NULL,
	[periodTime] [int] NULL,
	[periodTimeRemaining] [int] NULL,
	[dateTime] [nvarchar](max) NULL,
	[goals_away] [int] NULL,
	[goals_home] [int] NULL,
	[description] [nvarchar](max) NULL,
	[st_x] [nvarchar](max) NULL,
	[st_y] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_plays_players]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_plays_players](
	[play_id] [nvarchar](max) NULL,
	[game_id] [int] NULL,
	[player_id] [int] NULL,
	[playerType] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_scratches]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_scratches](
	[game_id] [int] NULL,
	[team_id] [int] NULL,
	[player_id] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[game_teams_stats]    Script Date: 5/6/2021 8:43:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[game_teams_stats](
	[game_id] [int] NULL,
	[team_id] [int] NULL,
	[HoA] [nvarchar](max) NULL,
	[won] [bit] NULL,
	[settled_in] [nvarchar](max) NULL,
	[head_coach] [nvarchar](max) NULL,
	[goals] [nvarchar](max) NULL,
	[shots] [nvarchar](max) NULL,
	[hits] [nvarchar](max) NULL,
	[pim] [nvarchar](max) NULL,
	[powerPlayOpportunities] [nvarchar](max) NULL,
	[powerPlayGoals] [nvarchar](max) NULL,
	[faceOffWinPercentage] [nvarchar](max) NULL,
	[giveaways] [nvarchar](max) NULL,
	[takeaways] [nvarchar](max) NULL,
	[blocked] [nvarchar](max) NULL,
	[startRinkSide] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "game_skater_stats"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 193
               Right = 269
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'aggplayerstats'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'aggplayerstats'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "game_skater_stats"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 253
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'avgplayerstats'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'avgplayerstats'
GO
