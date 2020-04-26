package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Game;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface GameMapper {

  @Select("SELECT * FROM Games WHERE MONTH(`date`)=${month} AND YEAR(`date`)=${year} ORDER BY `date`")
  List<Game> getGamesByMonthYear(@Param("month") Integer month, @Param("year") Integer year);

}
