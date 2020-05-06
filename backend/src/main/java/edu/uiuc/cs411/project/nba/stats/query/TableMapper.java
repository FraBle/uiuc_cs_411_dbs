package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.Table;
import edu.uiuc.cs411.project.nba.stats.domain.TableAndColumnPair;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface TableMapper {
    @Select("CALL TableByName('${tableName}')")
    Table getTableByNameMySql(String tableName);

    // Used only for testing env. Cannot use Stored Procedure as H2 does not support it.
    @Select("SELECT TABLE_NAME, ROW_COUNT_ESTIMATE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}'")
    Table getTableByNameH2(String tableName);

    @Select("CALL AllTables()")
    List<Table> fetchAllMySql();

    // Used only for testing env. Cannot use Stored Procedure as H2 does not support it.
    @Select("SELECT TABLE_NAME, ROW_COUNT_ESTIMATE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'TABLE'")
    List<Table> fetchAllH2();

    @Select("SELECT TABLE_NAME as tableName, COLUMN_NAME as columnName FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'nba'")
    List<TableAndColumnPair> fetchAllTableAndColumnPairsMysql();

    @Select("SELECT TABLE_NAME as tableName, COLUMN_NAME as columnName FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'PUBLIC'")
    List<TableAndColumnPair> fetchAllTableAndColumnPairsH2();
}
