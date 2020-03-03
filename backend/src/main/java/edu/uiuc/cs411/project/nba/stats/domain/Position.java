package edu.uiuc.cs411.project.nba.stats.domain;

public enum Position {

    PG("Point guard"),
    SG("Shooting guard"),
    SF("Small forward"),
    PF("Power forward"),
    C("Center");

    private final String name;

    Position(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
