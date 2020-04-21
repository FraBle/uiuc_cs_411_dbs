package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import edu.uiuc.cs411.project.nba.stats.query.PlayerStatsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/player/stats/")
public class PlayerStatsController {

    private final PlayerStatsMapper playerStatsMapper;

    @Autowired
    public PlayerStatsController(PlayerStatsMapper playerStatsMapper) {
        this.playerStatsMapper = playerStatsMapper;
    }

    @GetMapping("/{id}")
    public PlayerStats getPlayerStatsOverallById(@PathVariable("id") String id) {
        return playerStatsMapper.getPlayerStatsOverallById(Integer.parseInt(id));
    }

    @GetMapping("/{id}/season/{season}")
    public PlayerStats getPlayerStatsBySeasonById(@PathVariable("id") String id, @PathVariable("season") String season) {
        return playerStatsMapper.getPlayerStatsBySeasonById(Integer.parseInt(id), Integer.parseInt(season));
    }

    @GetMapping("/{id}/game/{game}")
    public PlayerStats getPlayerStatsByGameById(@PathVariable("id") String id, @PathVariable("game") String game) {
        return playerStatsMapper.getPlayerStatsByGameById(Integer.parseInt(id), Integer.parseInt(game));
    }

    @GetMapping("/{id}/season")
    public List<PlayerSeasonStats> getPlayerStatsGroupedBySeason(@PathVariable("id") String id) {
        return playerStatsMapper.getPlayerStatsGroupedBySeason(Integer.parseInt(id));
    }
}
