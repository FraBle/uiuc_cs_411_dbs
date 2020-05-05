package edu.uiuc.cs411.project.nba.stats.domain;

public class FranchiseStats extends Stats {
  private Integer franchise;
  private String franchiseName;

  public Integer getFranchise() {
    return this.franchise;
  }

  public void setFranchise(Integer franchise) {
    this.franchise = franchise;
  }

  public String getFranchiseName() {
    return this.franchiseName;
  }

  public void setFranchiseName(String franchiseName) {
    this.franchiseName = franchiseName;
  }

}
