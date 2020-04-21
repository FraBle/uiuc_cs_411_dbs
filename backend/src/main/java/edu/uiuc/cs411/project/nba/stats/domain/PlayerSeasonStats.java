package edu.uiuc.cs411.project.nba.stats.domain;

public class PlayerSeasonStats extends PlayerStats {
    private Integer season;

    public Integer getSeason() {
        return season;
    }

    public void setSeason(final Integer season) {
        this.season = season;
    }
}
