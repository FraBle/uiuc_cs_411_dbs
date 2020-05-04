package edu.uiuc.cs411.project.nba.stats.utils;

public class URLShortner {

    private static final char map[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    public static String toShortURL(int id) {
        final StringBuffer shorturl = new StringBuffer();

        while (id > 0) {
            shorturl.append(map[id % 62]);
            id = id / 62;
        }

        return shorturl.reverse().toString();
    }

    public static int toID(String shortURL) {
        int id = 0;

        for (int i = 0; i < shortURL.length(); i++) {
            if ('a' <= shortURL.charAt(i) && shortURL.charAt(i) <= 'z')
                id = id * 62 + shortURL.charAt(i) - 'a';

            if ('A' <= shortURL.charAt(i) && shortURL.charAt(i) <= 'Z')
                id = id * 62 + shortURL.charAt(i) - 'A' + 26;

            if ('0' <= shortURL.charAt(i) && shortURL.charAt(i) <= '9')
                id = id * 62 + shortURL.charAt(i) - '0' + 52;
        }

        return id;
    }

}
