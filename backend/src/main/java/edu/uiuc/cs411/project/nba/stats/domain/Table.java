package edu.uiuc.cs411.project.nba.stats.domain;

public class Table {
    private String name;
    private Integer nRows;

    public Table(String name, Integer nRows) {
        this.name = name;
        this.nRows = nRows;
    }

    public String getName() {
        return name;
    }
    public Integer getnRows() {
        return nRows;
    }
}
