package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerMapper {

    @Select("SELECT Player.*, EXISTS(SELECT * FROM FavoritesPlayer WHERE Player = ${id} AND Username = '${username}') as isFavorite FROM Player WHERE id = ${id}")
    Player getPlayerById(
        @Param("id") Integer id,
        @Param("username") String username
    );

    @Select("SELECT Player.*, EXISTS(SELECT * FROM FavoritesPlayer WHERE Player.id = FavoritesPlayer.Player AND FavoritesPlayer.Username = '${username}') as isFavorite FROM Player ORDER BY ${order} ${orderType} LIMIT ${pageSize} OFFSET ${offset}")
    List<Player> fetchAll(@Param("pageSize") int pageSize,
                          @Param("offset") int offset,
                          @Param("order") String order,
                          @Param("orderType") String orderType,
                          @Param("username") String username);

    @Select("SELECT COUNT(*) FROM Player")
    Long count();

}
