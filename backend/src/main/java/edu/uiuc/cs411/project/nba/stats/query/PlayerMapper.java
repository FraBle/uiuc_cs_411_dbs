package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PlayerMapper {

    @Select("SELECT Player.*, EXISTS(SELECT * FROM FavoritesPlayer WHERE Player = ${id} AND Username = '${username}') as isFavorite FROM Player WHERE id = ${id}")
    Player getPlayerById(Integer id, String username);

    @Select("SELECT Player.*, EXISTS(SELECT * FROM FavoritesPlayer WHERE Player.id = FavoritesPlayer.Player AND FavoritesPlayer.Username = '${username}') as isFavorite FROM Player WHERE LOWER(Player.Name) LIKE '%${search.replaceAll(\"'\", \"''\").trim().toLowerCase()}%' ORDER BY ${order} ${orderType} LIMIT ${pageSize} OFFSET ${offset}")
    List<Player> fetchAll(int pageSize, int offset, String order, String orderType, String search, String username);

    @Select("SELECT COUNT(*) FROM Player WHERE LOWER(Player.Name) LIKE '%${search.replaceAll(\"'\", \"''\").trim().toLowerCase()}%'")
    Long count(String search);

}
