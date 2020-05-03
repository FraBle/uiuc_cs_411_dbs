package edu.uiuc.cs411.project.nba.stats.domain;

import java.util.Date;

public class GamePlayer {

    private Integer id;
    private String name;
    private Integer franchise;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFranchise() {
        return this.franchise;
    }

    public void setFranchise(Integer franchise) {
        this.franchise = franchise;
    }

}
