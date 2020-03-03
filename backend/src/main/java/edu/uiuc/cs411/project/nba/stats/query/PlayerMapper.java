package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.UUID;

public interface PlayerMapper {

    @Select("SELECT * FROM PLAYER WHERE id = #{id}")
    Player getPlayerById(@Param("id") UUID id);

}
