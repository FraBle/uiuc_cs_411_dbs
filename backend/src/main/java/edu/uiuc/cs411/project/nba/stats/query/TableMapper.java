package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Table;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface TableMapper {
    @Select("SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'")
    Table getTableByNameMySql(String tableName);

    @Select("SELECT TABLE_NAME, ROW_COUNT_ESTIMATE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'")
    Table getTableByNameH2(String tableName);

    @Select("SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
    List<Table> fetchAllMySql();

    @Select("SELECT TABLE_NAME, ROW_COUNT_ESTIMATE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'TABLE'")
    List<Table> fetchAllH2();
}
