USE [nhl_db]
GO
/****** Object:  Table [dbo].[team_info]    Script Date: 5/3/2021 4:26:08 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[team_info]') AND type in (N'U'))
DROP TABLE [dbo].[team_info]
GO
/****** Object:  Table [dbo].[player_info]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[player_info]') AND type in (N'U'))
DROP TABLE [dbo].[player_info]
GO
/****** Object:  Table [dbo].[game_teams_stats]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_teams_stats]') AND type in (N'U'))
DROP TABLE [dbo].[game_teams_stats]
GO
/****** Object:  Table [dbo].[game_skater_stats]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_skater_stats]') AND type in (N'U'))
DROP TABLE [dbo].[game_skater_stats]
GO
/****** Object:  Table [dbo].[game_scratches]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_scratches]') AND type in (N'U'))
DROP TABLE [dbo].[game_scratches]
GO
/****** Object:  Table [dbo].[game_penalties]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_penalties]') AND type in (N'U'))
DROP TABLE [dbo].[game_penalties]
GO
/****** Object:  Table [dbo].[game_officials]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_officials]') AND type in (N'U'))
DROP TABLE [dbo].[game_officials]
GO
/****** Object:  Table [dbo].[game_goals]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_goals]') AND type in (N'U'))
DROP TABLE [dbo].[game_goals]
GO
/****** Object:  Table [dbo].[game_goalie_stats]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game_goalie_stats]') AND type in (N'U'))
DROP TABLE [dbo].[game_goalie_stats]
GO
/****** Object:  Table [dbo].[game]    Script Date: 5/3/2021 4:26:09 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[game]') AND type in (N'U'))
DROP TABLE [dbo].[game]
GO
