package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Table;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface TableMapper {
    @Select("SELECT '${tableName}', COUNT(*) FROM ${tableName}")
    Table getTableByName(String tableName);

    // Only works in MySql, not in H2
    @Select("SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES")
    List<Table> fetchAll();
}
