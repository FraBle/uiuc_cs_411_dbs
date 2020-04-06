package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Table;
import edu.uiuc.cs411.project.nba.stats.query.TableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

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

    // Only works in MySql, not in H2
    @GetMapping(value = { "", "/"})
    public List<Table> fetchAllTables() {
        if (isInDev())
            return tableMapper.fetchAllH2();
        else
            return tableMapper.fetchAllMySql();
    }

    private Boolean isInDev() {
        return Arrays.asList(env.getActiveProfiles()).contains("dev");
    }
}
