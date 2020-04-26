package edu.uiuc.cs411.project.nba.stats.domain;

public class Stats {
  private Integer minutesPlayed;
  private Integer fieldGoalsMade;
  private Integer fieldGoalsAttempted;
  private Integer threePointersMade;
  private Integer threePointersAttempted;
  private Integer freeThrowsMade;
  private Integer freeThrowsAttempted;
  private Integer offensiveRebounds;
  private Integer defensiveRebounds;
  private Integer points;
  private Integer assists;
  private Integer steals;
  private Integer blocks;
  private Integer turnovers;
  private Integer personalFouls;

  public Integer getMinutesPlayed() {
    return minutesPlayed;
  }

  public void setMinutesPlayed(final Integer minutesPlayed) {
    this.minutesPlayed = minutesPlayed;
  }

  public Integer getFieldGoalsMade() {
    return fieldGoalsMade;
  }

  public void setFieldGoalsMade(final Integer fieldGoalsMade) {
    this.fieldGoalsMade = fieldGoalsMade;
  }

  public Integer getFieldGoalsAttempted() {
    return fieldGoalsAttempted;
  }

  public void setFieldGoalsAttempted(final Integer fieldGoalsAttempted) {
    this.fieldGoalsAttempted = fieldGoalsAttempted;
  }

  public Integer getThreePointersMade() {
    return threePointersMade;
  }

  public void setThreePointersMade(final Integer threePointersMade) {
    this.threePointersMade = threePointersMade;
  }

  public Integer getThreePointersAttempted() {
    return threePointersAttempted;
  }

  public void setThreePointersAttempted(final Integer threePointersAttempted) {
    this.threePointersAttempted = threePointersAttempted;
  }

  public Integer getFreeThrowsMade() {
    return freeThrowsMade;
  }

  public void setFreeThrowsMade(final Integer freeThrowsMade) {
    this.freeThrowsMade = freeThrowsMade;
  }

  public Integer getFreeThrowsAttempted() {
    return freeThrowsAttempted;
  }

  public void setFreeThrowsAttempted(final Integer freeThrowsAttempted) {
    this.freeThrowsAttempted = freeThrowsAttempted;
  }

  public Integer getOffensiveRebounds() {
    return offensiveRebounds;
  }

  public void setOffensiveRebounds(final Integer offensiveRebounds) {
    this.offensiveRebounds = offensiveRebounds;
  }

  public Integer getDefensiveRebounds() {
    return defensiveRebounds;
  }

  public void setDefensiveRebounds(final Integer defensiveRebounds) {
    this.defensiveRebounds = defensiveRebounds;
  }

  public Integer getPoints() {
    return points;
  }

  public void setPoints(final Integer points) {
    this.points = points;
  }

  public Integer getAssists() {
    return assists;
  }

  public void setAssists(final Integer assists) {
    this.assists = assists;
  }

  public Integer getSteals() {
    return steals;
  }

  public void setSteals(final Integer steals) {
    this.steals = steals;
  }

  public Integer getBlocks() {
    return blocks;
  }

  public void setBlocks(final Integer blocks) {
    this.blocks = blocks;
  }

  public Integer getTurnovers() {
    return turnovers;
  }

  public void setTurnovers(final Integer turnovers) {
    this.turnovers = turnovers;
  }

  public Integer getPersonalFouls() {
    return personalFouls;
  }

  public void setPersonalFouls(final Integer personalFouls) {
    this.personalFouls = personalFouls;
  }
}
