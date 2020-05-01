package edu.uiuc.cs411.project.nba.stats.domain;

import java.beans.Transient;
import java.util.Date;

public class Game {
  private Integer id;
  private Integer season;
  private Integer homeFranchise;
  private Integer visitorFranchise;
  private Date date;
  private Integer homePoints;
  private Integer awayPoints;

  public Integer getId() {
    return this.id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getSeason() {
    return this.season;
  }

  public void setSeason(Integer season) {
    this.season = season;
  }

  public Integer getHomeFranchise() {
    return this.homeFranchise;
  }

  public void setHomeFranchise(Integer homeFranchise) {
    this.homeFranchise = homeFranchise;
  }

  public Integer getVisitorFranchise() {
    return this.visitorFranchise;
  }

  public void setVisitorFranchise(Integer visitorFranchise) {
    this.visitorFranchise = visitorFranchise;
  }

  public Date getDate() {
    return this.date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public Integer getHomePoints() {
    return homePoints;
  }

  public void setHomePoints(Integer homePoints) {
    this.homePoints = homePoints;
  }

  public Integer getAwayPoints() {
    return awayPoints;
  }

  public void setAwayPoints(Integer awayPoints) {
    this.awayPoints = awayPoints;
  }

  @Transient
  public int winner() {
    if (homePoints > awayPoints) {
      return homeFranchise;
    }

    return visitorFranchise;
  }

}
