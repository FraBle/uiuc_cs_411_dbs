package edu.uiuc.cs411.project.nba.stats.query;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface FavoritesPlayerMapper {

    @Select("SELECT EXISTS(SELECT 1 FROM FavoritesPlayer WHERE Username = #{username} AND " +
            "Player = #{playerId})")
    boolean isFavorited(String username, int playerId);

    @Insert("INSERT IGNORE INTO FavoritesPlayer(Player, Username) VALUES(#{playerId}, #{username})")
    void makeFavorite(String username, int playerId);

    @Delete("DELETE FROM FavoritesPlayer WHERE Username = #{username} AND Player = #{playerId}")
    void deleteFavorite(String username, int playerId);

    @Select("SELECT Player FROM FavoritesPlayer WHERE Username = #{username} ORDER BY ${order} " +
            "${orderType} LIMIT ${pageSize} " +
            "OFFSET ${offset} ")
    List<Integer> playerIdsByUsername(
                          String username,
                          @Param("pageSize") int pageSize,
                          @Param("offset") int offset,
                          @Param("order") String order,
                          @Param("orderType") String orderType);
}