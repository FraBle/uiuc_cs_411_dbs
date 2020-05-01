package edu.uiuc.cs411.project.nba.stats.rest.dto;

public class FranchiseResultDTO {

    private final int franchiseId;
    private final int victories;
    private final Double percentual;

    public FranchiseResultDTO(int franchiseId, int victories, Double percentual) {
        this.franchiseId = franchiseId;
        this.victories = victories;
        this.percentual = percentual;
    }

    public int getFranchiseId() {
        return franchiseId;
    }

    public int getVictories() {
        return victories;
    }

    public Double getPercentual() {
        return percentual;
    }

}
