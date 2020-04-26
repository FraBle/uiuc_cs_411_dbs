package edu.uiuc.cs411.project.nba.stats.domain;

import java.util.Date;

public class Game {
  private Integer id;
  private Integer season;
  private Integer homeFranchise;
  private Integer visitorFranchise;
  private Date data;

  public Integer getId() {
    return id;
  }

  public void setId(final Integer id) {
    this.id = id;
  }

  public Integer getSeason() {
    return season;
  }

  public void setSeason(final Integer season) {
    this.season = season;
  }

  public Integer getHomeFranchise() {
    return homeFranchise;
  }

  public void setHomeFranchise(final Integer homeFranchise) {
    this.homeFranchise = homeFranchise;
  }

  public Integer getVisitorFranchise() {
    return visitorFranchise;
  }

  public void setVisitorFranchise(final Integer visitorFranchise) {
    this.visitorFranchise = visitorFranchise;
  }

  public Date getData() {
    return data;
  }

  public void setData(final Date data) {
    this.data = data;
  }

}
