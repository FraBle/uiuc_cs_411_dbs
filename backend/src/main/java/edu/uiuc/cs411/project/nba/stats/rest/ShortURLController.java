package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.ShortURL;
import edu.uiuc.cs411.project.nba.stats.query.ShortURLMapper;
import edu.uiuc.cs411.project.nba.stats.utils.URLShortner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/api/shortURL")
public class ShortURLController {

    @Autowired
    private ShortURLMapper shortURLMapper;

    @GetMapping
    public synchronized String shortURL(@RequestParam("url") String url) {
        Integer id = shortURLMapper.find(url);

        if (id == null) {
            id = shortURLMapper.insert(new ShortURL(url));
        }

        return URLShortner.toShortURL(id);
    }

    @GetMapping("/{url}")
    public ModelAndView redirect(@PathVariable("url") String shortURL) {
        ShortURL url = shortURLMapper.findById(URLShortner.toID(shortURL));

        if (url == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid shorter URL");
        }

        String pathToRedirect = url.getUrl().startsWith("/") ? url.getUrl().substring(1) : url.getUrl();

        return new ModelAndView("redirect:/" + pathToRedirect);
    }

}
