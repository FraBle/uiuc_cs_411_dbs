package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerStatsMapper {
        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerAllStats JOIN Player ON (PlayerAllStats.Player = Player.ID) WHERE PlayerAllStats.Player = ${id}")
        PlayerStats getPlayerStatsOverallById(@Param("id") Integer id);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats JOIN Player ON (PlayerSeasonStats.Player = Player.ID) WHERE PlayerSeasonStats.Player = ${id} and Season = ${season}")
        PlayerStats getPlayerStatsBySeasonById(@Param("id") Integer id, @Param("season") Integer season);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, Season, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats JOIN Player ON (PlayerSeasonStats.Player = Player.ID) WHERE PlayerSeasonStats.Player = ${id} GROUP BY Season ORDER BY SEASON")
        List<PlayerSeasonStats> getPlayerStatsGroupedBySeason(@Param("id") Integer id);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerGameStats JOIN Player ON (PlayerGameStats.Player = Player.ID) WHERE PlayerGameStats.Player = ${id} and Game=${game}  LIMIT 1")
        PlayerStats getPlayerStatsByGameId(@Param("id") Integer id, @Param("game") Integer game);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerAllStats JOIN Player ON (PlayerAllStats.Player = Player.ID) ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStats(@Param("sortType") String sortType, @Param("topN") Integer n);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerGameStats JOIN Player ON (PlayerGameStats.Player = Player.ID) WHERE Game = ${game} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsByGame(@Param("game") Integer game, @Param("sortType") String sortType,
                        @Param("topN") Integer n);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats JOIN Player ON (PlayerSeasonStats.Player = Player.ID) WHERE Season = ${season} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsBySeason(@Param("season") Integer season, @Param("sortType") String sortType,
                        @Param("topN") Integer n);

        @Select("SELECT Player.ID AS Player, Player.Name as PlayerName, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerFranchiseStats JOIN Player ON (PlayerFranchiseStats.Player = Player.ID) WHERE Franchise = ${franchise} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsByFranchise(@Param("franchise") Integer franchise,
                        @Param("sortType") String sortType, @Param("topN") Integer n);
}
