package edu.uiuc.cs411.project.nba.stats.domain;

public class FranchiseWins {

    private int franchiseId;
    private String franchiseName;
    private int season;
    private Long victories;

    public int getFranchiseId() {
        return this.franchiseId;
    }

    public void setFranchiseId(int franchiseId) {
        this.franchiseId = franchiseId;
    }

    public String getFranchiseName() {
        return this.franchiseName;
    }

    public void setFranchiseName(String franchiseName) {
        this.franchiseName = franchiseName;
    }

    public Long getVictories() {
        return victories;
    }

    public void setVictories(Long victories) {
        this.victories = victories;
    }

    public int getSeason() {
        return season;
    }

    public void setSeason(int season) {
        this.season = season;
    }
}
