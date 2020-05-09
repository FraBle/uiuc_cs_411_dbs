package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.ShortURL;
import edu.uiuc.cs411.project.nba.stats.query.ShortURLMapper;
import edu.uiuc.cs411.project.nba.stats.utils.URLShortner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/shortURL")
public class ShortURLController {

    @Autowired
    private ShortURLMapper shortURLMapper;

    @PostMapping("")
    public ShortURL createShortURL(@RequestBody ShortURL url) {
        ShortURL shortUrl = shortURLMapper.find(url.getUrl());
        if (shortUrl == null) {
            shortUrl = new ShortURL(url.getUrl());
            shortURLMapper.insert(shortUrl);
        }
        shortUrl.setShortUrl(URLShortner.toShortURL(shortUrl.getId()));
        return shortUrl;
    }

    @GetMapping("")
    public ShortURL readShortURL(@RequestParam String shortURL) {
        ShortURL url = shortURLMapper.findById(URLShortner.toID(shortURL));

        if (url == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid shorter URL");
        }
        url.setShortUrl(shortURL);

        return url;
    }

}
