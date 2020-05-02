package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Game;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface GameMapper {

        @Select("SELECT Games.*, HomeFranchise.Abbreviation as HomeAbbreviation, HomeFranchise.City as HomeCity, HomeFranchise.Nickname as HomeNickname, VisitorFranchise.Abbreviation as VisitorAbbreviation, VisitorFranchise.City as VisitorCity, VisitorFranchise.Nickname as VisitorNickname FROM Games JOIN Franchise HomeFranchise ON Games.HomeFranchise=HomeFranchise.ID JOIN Franchise VisitorFranchise ON Games.VisitorFranchise=VisitorFranchise.ID WHERE MONTH(`date`)=${month} AND YEAR(`date`)=${year} ORDER BY `date`, Games.id")
        List<Game> getGamesByMonthYear(@Param("month") Integer month, @Param("year") Integer year);

        @Select("SELECT Games.*, HomeFranchise.Abbreviation as HomeAbbreviation, HomeFranchise.City as HomeCity, HomeFranchise.Nickname as HomeNickname, VisitorFranchise.Abbreviation as VisitorAbbreviation, VisitorFranchise.City as VisitorCity, VisitorFranchise.Nickname as VisitorNickname FROM Games JOIN Franchise HomeFranchise ON Games.HomeFranchise=HomeFranchise.ID JOIN Franchise VisitorFranchise ON Games.VisitorFranchise=VisitorFranchise.ID WHERE (HomeFranchise.ID = ${franchiseId} AND VisitorFranchise.ID = ${franchise2Id} OR HomeFranchise.ID = ${franchise2Id} AND VisitorFranchise.ID = ${franchiseId}) ORDER BY `date`, Games.id")
        List<Game> getGamesBetweenFranchises(int franchiseId, int franchise2Id);

        @Select("SELECT Games.*, HomeFranchise.Abbreviation as HomeAbbreviation, HomeFranchise.City as HomeCity, HomeFranchise.Nickname as HomeNickname, VisitorFranchise.Abbreviation as VisitorAbbreviation, VisitorFranchise.City as VisitorCity, VisitorFranchise.Nickname as VisitorNickname FROM Games JOIN Franchise HomeFranchise ON Games.HomeFranchise=HomeFranchise.ID JOIN Franchise VisitorFranchise ON Games.VisitorFranchise=VisitorFranchise.ID WHERE (HomeFranchise.ID = ${franchiseId} AND VisitorFranchise.ID = ${franchise2Id} OR HomeFranchise.ID = ${franchise2Id} AND VisitorFranchise.ID = ${franchiseId}) AND season = ${season} ORDER BY `date`, Games.id")
        List<Game> getGamesBetweenFranchisesInSeason(int franchiseId, int franchise2Id, int season);

        @Select("SELECT Games.*, HomeFranchise.Abbreviation as HomeAbbreviation, HomeFranchise.City as HomeCity, HomeFranchise.Nickname as HomeNickname, VisitorFranchise.Abbreviation as VisitorAbbreviation, VisitorFranchise.City as VisitorCity, VisitorFranchise.Nickname as VisitorNickname FROM Games JOIN Franchise HomeFranchise ON Games.HomeFranchise=HomeFranchise.ID JOIN Franchise VisitorFranchise ON Games.VisitorFranchise=VisitorFranchise.ID WHERE Games.ID=${id} ORDER BY `date`, Games.id")
        Game getGameById(Integer id);

}
