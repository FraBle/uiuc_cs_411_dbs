package edu.uiuc.cs411.project.nba.stats.query;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface FavoritesFranchiseMapper {

    @Select("SELECT EXISTS(SELECT 1 FROM FavoritesFranchise WHERE Username = #{username} AND Franchise = #{franchiseId})")
    boolean isFavorited(String username, int franchiseId);

    @Insert("INSERT IGNORE INTO FavoritesFranchise(Franchise, Username) VALUES(#{franchiseId}, #{username})")
    void makeFavorite(String username, int franchiseId);

    @Delete("DELETE FROM FavoritesFranchise WHERE Username = #{username} AND Franchise = #{franchiseId}")
    void deleteFavorite(String username, int franchiseId);

    @Select("SELECT Franchise FROM FavoritesFranchise WHERE Username = #{username} ORDER BY ${order} ${orderType} LIMIT ${pageSize} OFFSET ${offset} ")
    List<Integer> franchiseIdsByUsername(
            String username,
            @Param("pageSize") int pageSize,
            @Param("offset") int offset,
            @Param("order") String order,
            @Param("orderType") String orderType);
}