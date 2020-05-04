package edu.uiuc.cs411.project.nba.stats.domain;

public class ShortURL {

    private int id;
    private String url;

    public ShortURL() {
    }

    public ShortURL(String url) {
        this.url = url;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}
