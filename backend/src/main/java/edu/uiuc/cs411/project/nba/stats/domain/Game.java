package edu.uiuc.cs411.project.nba.stats.domain;

import java.util.Date;

public class Game {
  private Integer id;
  private Integer season;
  private Integer homeFranchise;
  private Integer visitorFranchise;
  private Date date;
  private String HomeAbbreviation;
  private String HomeCity;
  private String HomeNickname;
  private String VisitorAbbreviation;
  private String VisitorCity;
  private String VisitorNickname;

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

  public String getHomeAbbreviation() {
    return this.HomeAbbreviation;
  }

  public void setHomeAbbreviation(String HomeAbbreviation) {
    this.HomeAbbreviation = HomeAbbreviation;
  }

  public String getHomeCity() {
    return this.HomeCity;
  }

  public void setHomeCity(String HomeCity) {
    this.HomeCity = HomeCity;
  }

  public String getHomeNickname() {
    return this.HomeNickname;
  }

  public void setHomeNickname(String HomeNickname) {
    this.HomeNickname = HomeNickname;
  }

  public String getVisitorAbbreviation() {
    return this.VisitorAbbreviation;
  }

  public void setVisitorAbbreviation(String VisitorAbbreviation) {
    this.VisitorAbbreviation = VisitorAbbreviation;
  }

  public String getVisitorCity() {
    return this.VisitorCity;
  }

  public void setVisitorCity(String VisitorCity) {
    this.VisitorCity = VisitorCity;
  }

  public String getVisitorNickname() {
    return this.VisitorNickname;
  }

  public void setVisitorNickname(String VisitorNickname) {
    this.VisitorNickname = VisitorNickname;
  }

}
