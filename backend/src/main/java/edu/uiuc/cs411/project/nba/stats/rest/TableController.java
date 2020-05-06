package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Table;
import edu.uiuc.cs411.project.nba.stats.domain.TableAndColumnPair;
import edu.uiuc.cs411.project.nba.stats.query.TableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/table")
public class TableController {
    private final TableMapper tableMapper;

    @Autowired
    Environment env;

    @Autowired
    public TableController(TableMapper tableMapper) {
        this.tableMapper = tableMapper;
    }

    @GetMapping("/{tableName}")
    public Table fetchTableByName(@PathVariable("tableName") String tableName) {
        if (isInDev())
            return tableMapper.getTableByNameH2(tableName);
        else
            return tableMapper.getTableByNameMySql(tableName);
    }

    @GetMapping(value = { "", "/" })
    public List<Table> fetchAllTables() {
        if (isInDev())
            return tableMapper.fetchAllH2();
        else
            return tableMapper.fetchAllMySql();
    }

    @GetMapping(value = {"/column"})
    public Map<String, List<String>> fetchAllTableAndColumns() {
        List<TableAndColumnPair> tableAndCols;

        if (isInDev()) {
            tableAndCols = tableMapper.fetchAllTableAndColumnPairsH2();
        } else {
            tableAndCols = tableMapper.fetchAllTableAndColumnPairsMysql();
        }

        Map<String, List<String>> colsByTable = new HashMap<String, List<String>>();

        for (TableAndColumnPair pair: tableAndCols) {
            var tableName = pair.getTableName();
            var colName = pair.getColumnName();

            if (colsByTable.containsKey(tableName)){
                colsByTable.get(tableName).add(colName);
            } else {
                var colList = new ArrayList<String>();
                colList.add(colName);
                colsByTable.put(tableName, colList);
            }
        }
        return colsByTable;
    }

    private Boolean isInDev() {
        return Arrays.asList(env.getActiveProfiles()).contains("dev");
    }
}
