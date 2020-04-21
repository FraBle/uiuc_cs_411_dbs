package edu.uiuc.cs411.project.nba.stats.domain;

public class PlayerStats {
    private Integer MinutesPlayed;
    private Integer FieldGoalsMade;
    private Integer FieldGoalsAttempted;
    private Integer ThreePointersMade;
    private Integer ThreePointersAttempted;
    private Integer FreeThrowsMade;
    private Integer FreeThrowsAttempted;
    private Integer OffensiveRebounds;
    private Integer DefensiveRebounds;
    private Integer Points;
    private Integer Assists;
    private Integer Steals;
    private Integer Blocks;
    private Integer Turnovers;
    private Integer PersonalFouls;

    public void setMinutesPlayed(final Integer minutesPlayed) {
        MinutesPlayed = minutesPlayed;
    }

    public void setFieldGoalsMade(final Integer fieldGoalsMade) {
        FieldGoalsMade = fieldGoalsMade;
    }

    public void setFieldGoalsAttempted(final Integer fieldGoalsAttempted) {
        FieldGoalsAttempted = fieldGoalsAttempted;
    }

    public void setThreePointersMade(final Integer threePointersMade) {
        ThreePointersMade = threePointersMade;
    }

    public void setThreePointersAttempted(final Integer threePointersAttempted) {
        ThreePointersAttempted = threePointersAttempted;
    }

    public void setFreeThrowsMade(final Integer freeThrowsMade) {
        FreeThrowsMade = freeThrowsMade;
    }

    public void setFreeThrowsAttempted(final Integer freeThrowsAttempted) {
        FreeThrowsAttempted = freeThrowsAttempted;
    }

    public void setOffensiveRebounds(final Integer offensiveRebounds) {
        OffensiveRebounds = offensiveRebounds;
    }

    public void setDefensiveRebounds(final Integer defensiveRebounds) {
        DefensiveRebounds = defensiveRebounds;
    }

    public void setPoints(final Integer points) {
        Points = points;
    }

    public void setAssists(final Integer assists) {
        Assists = assists;
    }

    public void setSteals(final Integer steals) {
        Steals = steals;
    }

    public void setBlocks(final Integer blocks) {
        Blocks = blocks;
    }

    public void setTurnovers(final Integer turnovers) {
        Turnovers = turnovers;
    }

    public void setPersonalFouls(final Integer personalFouls) {
        PersonalFouls = personalFouls;
    }

    public Integer getMinutesPlayed() {
        return MinutesPlayed;
    }

    public Integer getFieldGoalsMade() {
        return FieldGoalsMade;
    }

    public Integer getFieldGoalsAttempted() {
        return FieldGoalsAttempted;
    }

    public Integer getThreePointersMade() {
        return ThreePointersMade;
    }

    public Integer getThreePointersAttempted() {
        return ThreePointersAttempted;
    }

    public Integer getFreeThrowsMade() {
        return FreeThrowsMade;
    }

    public Integer getFreeThrowsAttempted() {
        return FreeThrowsAttempted;
    }

    public Integer getOffensiveRebounds() {
        return OffensiveRebounds;
    }

    public Integer getDefensiveRebounds() {
        return DefensiveRebounds;
    }

    public Integer getPoints() {
        return Points;
    }

    public Integer getAssists() {
        return Assists;
    }

    public Integer getSteals() {
        return Steals;
    }

    public Integer getBlocks() {
        return Blocks;
    }

    public Integer getTurnovers() {
        return Turnovers;
    }

    public Integer getPersonalFouls() {
        return PersonalFouls;
    }
}
