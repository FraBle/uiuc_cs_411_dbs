package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface FranchiseMapper {

    @Select("SELECT Franchise.*, EXISTS(SELECT * FROM FavoritesFranchise WHERE Franchise = ${id} AND Username = '${username}') as isFavorite FROM Franchise WHERE id = ${id}")
    Franchise getFranchiseById(
        @Param("id") Integer id,
        @Param("username") String username
    );

    @Select("SELECT Franchise.*, EXISTS(SELECT * FROM FavoritesFranchise WHERE Franchise.id = FavoritesFranchise.Franchise AND FavoritesFranchise.Username = '${username}') as isFavorite FROM Franchise ORDER BY ${order} ${orderType} LIMIT ${pageSize} OFFSET ${offset}")
    List<Franchise> fetchAll(@Param("pageSize") int pageSize,
                          @Param("offset") int offset,
                          @Param("order") String order,
                          @Param("orderType") String orderType,
                          @Param("username") String username);

    @Select("SELECT COUNT(*) FROM Franchise")
    Long count();

}
