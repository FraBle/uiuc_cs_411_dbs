package edu.uiuc.cs411.project.nba.stats.rest.dto;

public class FranchiseHeadToHeadDTO {

    private final FranchiseResultDTO left;
    private final FranchiseResultDTO right;

    public FranchiseHeadToHeadDTO(FranchiseResultDTO left, FranchiseResultDTO right) {
        this.left = left;
        this.right = right;
    }

    public FranchiseResultDTO getLeft() {
        return left;
    }

    public FranchiseResultDTO getRight() {
        return right;
    }

}
