package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import edu.uiuc.cs411.project.nba.stats.domain.User;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
import edu.uiuc.cs411.project.nba.stats.query.PlayerStatsMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

    private final PlayerMapper playerMapper;
    private final PlayerStatsMapper playerStatsMapper;

    @Autowired
    public PlayerController(PlayerMapper playerMapper, PlayerStatsMapper playerStatsMapper) {
        this.playerMapper = playerMapper;
        this.playerStatsMapper = playerStatsMapper;
    }

    @GetMapping("/count")
    public Long count(@RequestParam(defaultValue = "", required = false) String search) {
        return playerMapper.count(search);
    }

    @GetMapping("/{id}")
    public Player fetchPlayerById(@AuthenticationPrincipal User user, @PathVariable("id") String id) {
        return playerMapper.getPlayerById(Integer.parseInt(id), user.getUsername());
    }

    @GetMapping(value = { "", "/" })
    public List<Player> fetchAllPlayers(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") String page, @RequestParam(defaultValue = "50") String pageSize,
            @RequestParam(defaultValue = "id") String order, @RequestParam(defaultValue = "ASC") String orderType,
            @RequestParam(defaultValue = "", required = false) String search) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return playerMapper.fetchAll(pageSizeAsInteger, offset, order, orderTypeValue, search, user.getUsername());
    }

    // PlayerStats sub-resource
    @GetMapping("/{id}/stats")
    public PlayerStats getPlayerStatsOverallById(@PathVariable("id") String id) {
        return playerStatsMapper.getPlayerStatsOverallById(Integer.parseInt(id));
    }

    @GetMapping("/{id}/stats/season/{season}")
    public PlayerStats getPlayerStatsBySeasonById(@PathVariable("id") String id,
            @PathVariable("season") String season) {
        return playerStatsMapper.getPlayerStatsBySeasonById(Integer.parseInt(id), Integer.parseInt(season));
    }

    @GetMapping("/{id}/stats/game/{game}")
    public PlayerStats getPlayerStatsByGameId(@PathVariable("id") String id, @PathVariable("game") String game) {
        return playerStatsMapper.getPlayerStatsByGameId(Integer.parseInt(id), Integer.parseInt(game));
    }

    @GetMapping("/{id}/stats/season")
    public List<PlayerSeasonStats> getPlayerStatsGroupedBySeason(@PathVariable("id") String id) {
        return playerStatsMapper.getPlayerStatsGroupedBySeason(Integer.parseInt(id));
    }

    @GetMapping(value = { "/stats/top/", "/stats/top/all" })
    public List<PlayerStats> topPlayerStats(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType) {
        return playerStatsMapper.topPlayerStats(sortType, Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/season/{season}")
    public List<PlayerStats> topPlayerStatsBySeason(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType, @PathVariable("season") String season) {
        return playerStatsMapper.topPlayerStatsBySeason(Integer.parseInt(season), sortType, Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/franchise/{franchise}")
    public List<PlayerStats> topPlayerStatsByFranchise(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType, @PathVariable("season") String franchise) {
        return playerStatsMapper.topPlayerStatsByFranchise(Integer.parseInt(franchise), sortType,
                Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/game/{game}")
    public List<PlayerStats> topPlayerStatsByGame(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType, @PathVariable("game") String game) {
        return playerStatsMapper.topPlayerStatsByGame(Integer.parseInt(game), sortType, Integer.parseInt(topN));
    }
}
