package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.query.FavoritesFranchiseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/")
public class FavoritesFranchiseController {

    private final FavoritesFranchiseMapper favoritesFranchiseMapper;

    @Autowired
    public FavoritesFranchiseController(FavoritesFranchiseMapper favoritesFranchiseMapper) {
        this.favoritesFranchiseMapper = favoritesFranchiseMapper;
    }

    @GetMapping("/{username}/favorite/franchise/")
    public List<Integer> favoriteFranchiseIdsByUsername(@PathVariable("username") String username,
                                           @RequestParam(defaultValue = "1") String page,
                                           @RequestParam(defaultValue = "50") String pageSize,
                                           @RequestParam(defaultValue = "id") String order,
                                           @RequestParam(defaultValue = "ASC") String orderType) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return favoritesFranchiseMapper.franchiseIdsByUsername(username, pageSizeAsInteger,
                offset, order, orderTypeValue);
    }

    @PutMapping("/{username}/favorite/franchise/{franchiseId}")
    void makeFavorite(@PathVariable("username") String username,
                      @PathVariable("franchiseId") int franchiseId) {
        favoritesFranchiseMapper.makeFavorite(username, franchiseId);
    }

    @DeleteMapping("/{username}/favorite/franchise/{franchiseId}")
    void deleteFavorite(@PathVariable("username") String username,
                        @PathVariable("franchiseId") int franchiseId) {
        favoritesFranchiseMapper.deleteFavorite(username, franchiseId);
    }
}
