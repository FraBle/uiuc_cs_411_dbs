package edu.uiuc.cs411.project.nba.stats.domain;

public class PlayerStats extends Stats {
  private Integer player;
  private String playerName;

  public Integer getPlayer() {
    return this.player;
  }

  public void setPlayer(Integer player) {
    this.player = player;
  }

  public String getPlayerName() {
    return this.playerName;
  }

  public void setPlayerName(String playerName) {
    this.playerName = playerName;
  }

}
