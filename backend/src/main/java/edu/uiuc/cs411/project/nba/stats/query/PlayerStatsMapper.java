package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerStatsMapper {
    @Select("SELECT MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerAllStats WHERE Player = ${id}")
    PlayerStats getPlayerStatsOverallById(@Param("id") Integer id);

    @Select("SELECT MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats WHERE Player = ${id} and Season = ${season}")
    PlayerStats getPlayerStatsBySeasonById(@Param("id") Integer id, @Param("season") Integer season);

    @Select("SELECT Season, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats WHERE Player = ${id} GROUP BY Season ORDER BY SEASON")
    List<PlayerSeasonStats> getPlayerStatsGroupedBySeason(@Param("id") Integer id);

    @Select("SELECT MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerGameStats WHERE Player = ${id} and Game = ${game}")
    PlayerStats getPlayerStatsByGameById(@Param("id") Integer id, @Param("game") Integer game);
}
