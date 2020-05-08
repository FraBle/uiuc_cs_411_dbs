package edu.uiuc.cs411.project.nba.stats.domain;

public class ShortURL {

    private int id;
    private String url;
    private String shortUrl;

    public ShortURL() {
    }

    public ShortURL(String url) {
        this.url = url;
    }

    public ShortURL(int id, String url) {
        this.id = id;
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

    public String getShortUrl() {
        return this.shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

}
