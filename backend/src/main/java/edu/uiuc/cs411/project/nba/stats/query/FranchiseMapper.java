package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface FranchiseMapper {

    @Select("SELECT Franchise.*, EXISTS(" +
            "   SELECT * " +
            "   FROM FavoritesFranchise " +
            "   WHERE Franchise = ${id} " +
            "   AND Username = '${username}'" +
            ") AS isFavorite " +
            "FROM Franchise " +
            "WHERE id = ${id}")
    Franchise getFranchiseById(Integer id, String username);

    @Select("SELECT Franchise.*, EXISTS(" +
            "   SELECT * " +
            "   FROM FavoritesFranchise " +
            "   WHERE Franchise.id = FavoritesFranchise.Franchise " +
            "   AND FavoritesFranchise.Username = '${username}'" +
            ") AS isFavorite FROM Franchise " +
            "WHERE (LOWER(nickname) LIKE '%${search.toLowerCase()}%' OR LOWER(city) LIKE '%${search.toLowerCase()}%')" +
            "ORDER BY ${order} ${orderType} " +
            "LIMIT ${pageSize} OFFSET ${offset}")
    List<Franchise> fetchAll(int pageSize, int offset, String order, String orderType, String username, String search);

    @Select("SELECT COUNT(*) FROM Franchise " +
            "WHERE (LOWER(nickname) LIKE '%${search.toLowerCase()}%' OR LOWER(city) LIKE '%${search.toLowerCase()}%')")
    Long count(String search);

}
