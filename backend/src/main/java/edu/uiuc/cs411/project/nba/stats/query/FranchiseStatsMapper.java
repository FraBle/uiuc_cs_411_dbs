package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.FranchiseSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseStats;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseWins;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface FranchiseStatsMapper {

        @Select("SELECT Franchise, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseAllStats WHERE Franchise = ${id}")
        FranchiseStats getFranchiseStatsOverallById(@Param("id") Integer id);

        @Select("SELECT Franchise, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseSeasonStats WHERE Franchise = ${id} and Season = ${season}")
        FranchiseStats getFranchiseStatsBySeasonById(@Param("id") Integer id, @Param("season") Integer season);

        @Select("SELECT Franchise, Season, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseSeasonStats WHERE Franchise = ${id} GROUP BY Season ORDER BY SEASON")
        List<FranchiseSeasonStats> getFranchiseStatsGroupedBySeason(@Param("id") Integer id);

        @Select("SELECT Franchise, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseGameStats WHERE Franchise = ${id} and Game=${game} LIMIT 1")
        FranchiseStats getFranchiseStatsByGameId(@Param("id") Integer id, @Param("game") Integer game);

        @Select("SELECT Franchise.ID as Franchise, CONCAT(Franchise.City, ' ', Franchise.Nickname) as FranchiseName, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseAllStats JOIN Franchise ON (FranchiseAllStats.Franchise = Franchise.ID) ORDER by ${sortType} DESC LIMIT ${topN}")
        List<FranchiseStats> topFranchiseStats(@Param("sortType") String sortType, @Param("topN") Integer n);

        @Select("SELECT Franchise.ID as Franchise, CONCAT(Franchise.City, ' ', Franchise.Nickname) as FranchiseName, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseGameStats JOIN Franchise ON (FranchiseGameStats.Franchise = Franchise.ID) WHERE Game = ${game} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<FranchiseStats> topFranchiseStatsByGame(@Param("game") Integer game, @Param("sortType") String sortType,
                        @Param("topN") Integer n);

        @Select("SELECT Franchise.ID as Franchise, CONCAT(Franchise.City, ' ', Franchise.Nickname) as FranchiseName, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds, Points, Assists, Steals, Blocks, Turnovers, PersonalFouls FROM FranchiseSeasonStats JOIN Franchise ON (FranchiseSeasonStats.Franchise = Franchise.ID) WHERE Season = ${season} ORDER by ${sortType} DESC LIMIT ${topN}")
        List<FranchiseStats> topFranchiseStatsBySeason(@Param("season") Integer season,
                        @Param("sortType") String sortType, @Param("topN") Integer n);

        @Select("SELECT * FROM FranchiseWins WHERE Franchise=${franchiseId}")
        FranchiseWins getFranchiseWins(int franchiseId);

        @Select("SELECT * FROM FranchiseWinsBySeason WHERE Franchise=${franchiseId} AND SEASON=${season}")
        FranchiseWins getFranchiseWinsBySeason(int franchiseId, int season);

        @Select("SELECT * FROM FranchiseWins ORDER BY Victories DESC LIMIT ${topN}")
        List<FranchiseWins> getTopFranchiseByVictories(Integer topN);

        @Select("SELECT * FROM FranchiseWinsBySeason WHERE SEASON=${season} ORDER BY Victories DESC, Franchise LIMIT ${topN}")
        List<FranchiseWins> getTopFranchiseByVictoriesOnSeason(Integer topN, int season);

}
