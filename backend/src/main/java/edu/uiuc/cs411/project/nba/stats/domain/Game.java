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
    private Double homeFieldGoalPercentage;
    private Double homeFreeThrowPercentage;
    private Double homeThreePointerPercentage;
    private Double homeAssists;
    private Double homeRebounds;
    private String homeAbbreviation;
    private String HomeCity;
    private String homeNickname;
    private Integer awayPoints;
    private Double awayFieldGoalPercentage;
    private Double awayFreeThrowPercentage;
    private Double awayThreePointerPercentage;
    private Double awayAssists;
    private Double awayRebounds;
    private String visitorAbbreviation;
    private String visitorCity;
    private String visitorNickname;

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
        return this.homePoints;
    }

    public void setHomePoints(Integer homePoints) {
        this.homePoints = homePoints;
    }

    public Double getHomeFieldGoalPercentage() {
        return this.homeFieldGoalPercentage;
    }

    public void setHomeFieldGoalPercentage(Double homeFieldGoalPercentage) {
        this.homeFieldGoalPercentage = homeFieldGoalPercentage;
    }

    public Double getHomeFreeThrowPercentage() {
        return this.homeFreeThrowPercentage;
    }

    public void setHomeFreeThrowPercentage(Double homeFreeThrowPercentage) {
        this.homeFreeThrowPercentage = homeFreeThrowPercentage;
    }

    public Double getHomeThreePointerPercentage() {
        return this.homeThreePointerPercentage;
    }

    public void setHomeThreePointerPercentage(Double homeThreePointerPercentage) {
        this.homeThreePointerPercentage = homeThreePointerPercentage;
    }

    public Double getHomeAssists() {
        return this.homeAssists;
    }

    public void setHomeAssists(Double homeAssists) {
        this.homeAssists = homeAssists;
    }

    public Double getHomeRebounds() {
        return this.homeRebounds;
    }

    public void setHomeRebounds(Double homeRebounds) {
        this.homeRebounds = homeRebounds;
    }

    public String getHomeAbbreviation() {
        return this.homeAbbreviation;
    }

    public void setHomeAbbreviation(String homeAbbreviation) {
        this.homeAbbreviation = homeAbbreviation;
    }

    public String getHomeCity() {
        return this.HomeCity;
    }

    public void setHomeCity(String HomeCity) {
        this.HomeCity = HomeCity;
    }

    public String getHomeNickname() {
        return this.homeNickname;
    }

    public void setHomeNickname(String homeNickname) {
        this.homeNickname = homeNickname;
    }

    public Integer getAwayPoints() {
        return this.awayPoints;
    }

    public void setAwayPoints(Integer awayPoints) {
        this.awayPoints = awayPoints;
    }

    public Double getAwayFieldGoalPercentage() {
        return this.awayFieldGoalPercentage;
    }

    public void setAwayFieldGoalPercentage(Double awayFieldGoalPercentage) {
        this.awayFieldGoalPercentage = awayFieldGoalPercentage;
    }

    public Double getAwayFreeThrowPercentage() {
        return this.awayFreeThrowPercentage;
    }

    public void setAwayFreeThrowPercentage(Double awayFreeThrowPercentage) {
        this.awayFreeThrowPercentage = awayFreeThrowPercentage;
    }

    public Double getAwayThreePointerPercentage() {
        return this.awayThreePointerPercentage;
    }

    public void setAwayThreePointerPercentage(Double awayThreePointerPercentage) {
        this.awayThreePointerPercentage = awayThreePointerPercentage;
    }

    public Double getAwayAssists() {
        return this.awayAssists;
    }

    public void setAwayAssists(Double awayAssists) {
        this.awayAssists = awayAssists;
    }

    public Double getAwayRebounds() {
        return this.awayRebounds;
    }

    public void setAwayRebounds(Double awayRebounds) {
        this.awayRebounds = awayRebounds;
    }

    public String getVisitorAbbreviation() {
        return this.visitorAbbreviation;
    }

    public void setVisitorAbbreviation(String visitorAbbreviation) {
        this.visitorAbbreviation = visitorAbbreviation;
    }

    public String getVisitorCity() {
        return this.visitorCity;
    }

    public void setVisitorCity(String visitorCity) {
        this.visitorCity = visitorCity;
    }

    public String getVisitorNickname() {
        return this.visitorNickname;
    }

    public void setVisitorNickname(String visitorNickname) {
        this.visitorNickname = visitorNickname;
    }

    @Transient
    public int winner() {
        if (homePoints > awayPoints) {
            return homeFranchise;
        }

        return visitorFranchise;
    }

}
