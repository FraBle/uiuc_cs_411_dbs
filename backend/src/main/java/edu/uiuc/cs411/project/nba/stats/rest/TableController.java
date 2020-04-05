package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.Table;
import edu.uiuc.cs411.project.nba.stats.query.TableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/table")
public class TableController {
    private final TableMapper tableMapper;

    @Autowired
    public TableController(TableMapper tableMapper) {
        this.tableMapper = tableMapper;
    }

    @GetMapping("/{tableName}")
    public Table fetchTableByName(@PathVariable("id") String tableName) {
        return tableMapper.getTableByName(tableName);
    }

    // Only works in MySql, not in H2
    @GetMapping(value = { "", "/"})
    public List<Table> fetchAllTables() {
        return tableMapper.fetchAll();
    }
}
