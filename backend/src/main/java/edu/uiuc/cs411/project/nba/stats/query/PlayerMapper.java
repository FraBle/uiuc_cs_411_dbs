package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerMapper {

    @Select("SELECT * FROM Player WHERE id = ${id}")
    Player getPlayerById(@Param("id") Integer id);

    @Select("SELECT * FROM Player ORDER BY ${order} LIMIT ${pageSize} OFFSET ${offset}")
    List<Player> fetchAll(@Param("pageSize") int pageSize, @Param("offset") int offset, @Param("order") String order);

    @Select("SELECT COUNT(*) FROM Player")
    Long count();

}
