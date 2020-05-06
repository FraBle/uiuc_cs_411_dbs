package edu.uiuc.cs411.project.nba.stats.domain;

public class TableAndColumnPair {
  private String tableName;
  private String columnName;

  public String getTableName() {
    return tableName;
  }

  public void setTableName(final String tableName) {
    this.tableName = tableName;
  }

  public String getColumnName() {
    return columnName;
  }

  public void setColumnName(final String columnName) {
    this.columnName = columnName;
  }
}
