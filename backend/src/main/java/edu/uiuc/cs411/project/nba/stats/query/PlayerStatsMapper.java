package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerStatsMapper {
        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerAllStats WHERE Player = ${id}")
        PlayerStats getPlayerStatsOverallById(@Param("id") Integer id);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats WHERE Player = ${id} and Season = ${season}")
        PlayerStats getPlayerStatsBySeasonById(@Param("id") Integer id, @Param("season") Integer season);

        @Select("SELECT Player, Season, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats WHERE Player = ${id} GROUP BY Season ORDER BY SEASON")
        List<PlayerSeasonStats> getPlayerStatsGroupedBySeason(@Param("id") Integer id);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerGameStats WHERE Player = ${id} and Game=${game}  LIMIT 1")
        PlayerStats getPlayerStatsByGameId(@Param("id") Integer id, @Param("game") Integer game);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerAllStats ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStats(@Param("sortType") String sortType, @Param("topN") Integer n);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerGameStats WHERE Game = ${game} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsByGame(@Param("game") Integer game, @Param("sortType") String sortType,
                        @Param("topN") Integer n);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerSeasonStats WHERE Season = ${season} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsBySeason(@Param("season") Integer season, @Param("sortType") String sortType,
                        @Param("topN") Integer n);

        @Select("SELECT Player, MinutesPlayed, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM PlayerFranchiseStats WHERE Franchise = ${franchise} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<PlayerStats> topPlayerStatsByFranchise(@Param("franchise") Integer franchise,
                        @Param("sortType") String sortType, @Param("topN") Integer n);
}
