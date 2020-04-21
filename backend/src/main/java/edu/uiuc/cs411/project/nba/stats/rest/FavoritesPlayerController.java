package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.query.FavoritesPlayerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class FavoritesPlayerController {

    private final FavoritesPlayerMapper favoritesPlayerMapper;

    @Autowired
    public FavoritesPlayerController(FavoritesPlayerMapper favoritesPlayerMapper) {
        this.favoritesPlayerMapper = favoritesPlayerMapper;
    }

    @GetMapping("/{username}/favorite/player")
    public List<Player> favoritePlayerIdsByUsername(@PathVariable("username") String username,
                                           @RequestParam(defaultValue = "1") String page,
                                           @RequestParam(defaultValue = "50") String pageSize,
                                           @RequestParam(defaultValue = "ID") String order,
                                           @RequestParam(defaultValue = "ASC") String orderType) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return favoritesPlayerMapper.playerIdsByUsername(username, pageSizeAsInteger, offset, order, orderTypeValue);
    }

    @PutMapping("/{username}/favorite/player/{playerId}")
    void makeFavorite(@PathVariable("username") String username,
                                      @PathVariable("playerId") int playerId) {
        favoritesPlayerMapper.makeFavorite(username, playerId);
    }

    @DeleteMapping("/{username}/favorite/player/{playerId}")
    void deleteFavorite(@PathVariable("username") String username,
                      @PathVariable("playerId") int playerId) {
        favoritesPlayerMapper.deleteFavorite(username, playerId);
    }
}
