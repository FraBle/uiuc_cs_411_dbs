package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseStats;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseWins;
import edu.uiuc.cs411.project.nba.stats.domain.Game;
import edu.uiuc.cs411.project.nba.stats.domain.User;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseMapper;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseStatsMapper;
import edu.uiuc.cs411.project.nba.stats.query.GameMapper;
import edu.uiuc.cs411.project.nba.stats.rest.dto.FranchiseHeadToHeadDTO;
import edu.uiuc.cs411.project.nba.stats.rest.dto.FranchiseResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/franchise")
public class FranchiseController {

    private final FranchiseMapper franchiseMapper;
    private final FranchiseStatsMapper franchiseStatsMapper;
    private final GameMapper gameMapper;

    @Autowired
    public FranchiseController(FranchiseMapper franchiseMapper, FranchiseStatsMapper franchiseStatsMapper,
            GameMapper gameMapper) {
        this.franchiseMapper = franchiseMapper;
        this.franchiseStatsMapper = franchiseStatsMapper;
        this.gameMapper = gameMapper;
    }

    @GetMapping("/count")
    public Long count(@RequestParam(defaultValue = "") String search) {
        return franchiseMapper.count(search);
    }

    @GetMapping("/{id}")
    public Franchise fetchFranchiseById(@AuthenticationPrincipal User user, @PathVariable("id") String id) {
        return franchiseMapper.getFranchiseById(Integer.parseInt(id), user.getUsername());
    }

    @GetMapping(value = { "", "/" })
    public List<Franchise> fetchAllFranchises(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") String page, @RequestParam(defaultValue = "50") String pageSize,
            @RequestParam(defaultValue = "id") String order, @RequestParam(defaultValue = "ASC") String orderType,
            @RequestParam(defaultValue = "") String search) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return franchiseMapper.fetchAll(pageSizeAsInteger, offset, order, orderTypeValue, user.getUsername(), search);
    }

    @GetMapping("/head-to-head")
    public FranchiseHeadToHeadDTO headToHead(@RequestParam String franchise1, @RequestParam String franchise2,
            @RequestParam(defaultValue = "") String season) {
        int franchise1Id = Integer.parseInt(franchise1);
        int franchise2Id = Integer.parseInt(franchise2);
        Integer seasonYear = season.isEmpty() ? null : Integer.parseInt(season);

        List<Game> games = seasonYear == null ? gameMapper.getGamesBetweenFranchises(franchise1Id, franchise2Id)
                : gameMapper.getGamesBetweenFranchisesInSeason(franchise1Id, franchise2Id, seasonYear);

        return translateGamesToHeadToHead(games, franchise1Id, franchise2Id);
    }

    private FranchiseHeadToHeadDTO translateGamesToHeadToHead(List<Game> games, int franchise1, int franchise2) {
        int franchise1Victories = 0;
        int franchise2Victories = 0;

        for (Game game : games) {
            if (game.winner() == franchise1) {
                franchise1Victories++;
            } else {
                franchise2Victories++;
            }
        }

        int totalGames = franchise1Victories + franchise2Victories;
        Double franchise1Percentual = franchise1Victories == 0 ? 0D : (franchise1Victories / (totalGames * 1D)) * 100D;
        Double franchise2Percentual = franchise2Victories == 0 ? 0D : (franchise2Victories / (totalGames * 1D)) * 100D;

        FranchiseResultDTO franchise1Result = new FranchiseResultDTO(franchise1, franchise1Victories,
                franchise1Percentual);
        FranchiseResultDTO franchise2Result = new FranchiseResultDTO(franchise2, franchise2Victories,
                franchise2Percentual);

        return new FranchiseHeadToHeadDTO(franchise1Result, franchise2Result);
    }

    // FranchiseStats sub-resource
    @GetMapping("/{id}/stats")
    public FranchiseStats getFranchiseStatsOverallById(@PathVariable("id") String id) {
        return franchiseStatsMapper.getFranchiseStatsOverallById(Integer.parseInt(id));
    }

    @GetMapping("/{id}/stats/season/{season}")
    public FranchiseStats getFranchiseStatsBySeasonById(@PathVariable("id") String id,
            @PathVariable("season") String season) {
        return franchiseStatsMapper.getFranchiseStatsBySeasonById(Integer.parseInt(id), Integer.parseInt(season));
    }

    @GetMapping("/{id}/stats/game/{game}")
    public FranchiseStats getFranchiseStatsByGameId(@PathVariable("id") String id, @PathVariable("game") String game) {
        return franchiseStatsMapper.getFranchiseStatsByGameId(Integer.parseInt(id), Integer.parseInt(game));
    }

    @GetMapping("/{id}/stats/season")
    public List<FranchiseSeasonStats> getFranchiseStatsGroupedBySeason(@PathVariable("id") String id) {
        return franchiseStatsMapper.getFranchiseStatsGroupedBySeason(Integer.parseInt(id));
    }

    @GetMapping("/stats/top")
    public List<FranchiseStats> topFranchiseStats(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType) {
        return franchiseStatsMapper.topFranchiseStats(sortType, Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/season/{season}")
    public List<FranchiseStats> topFranchiseStatsBySeason(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType, @PathVariable("season") String season) {
        return franchiseStatsMapper.topFranchiseStatsBySeason(Integer.parseInt(season), sortType, Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/game/{game}")
    public List<FranchiseStats> topFranchiseStatsByGame(@RequestParam("topN") String topN,
            @RequestParam("sortType") String sortType, @PathVariable("game") String game) {
        return franchiseStatsMapper.topFranchiseStatsByGame(Integer.parseInt(game), sortType, Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/victories")
    public List<FranchiseWins> topFranchiseStatsByVictory(@RequestParam(value = "topN", defaultValue = "10") String topN) {
        return franchiseStatsMapper.getTopFranchiseByVictories(Integer.parseInt(topN));
    }

    @GetMapping("/stats/top/season/{season}/victories")
    public List<FranchiseWins> topFranchiseStatsByVictoryOnSeason(@RequestParam(value = "topN", defaultValue = "10") String topN, @PathVariable("season") String season) {
        return franchiseStatsMapper.getTopFranchiseByVictoriesOnSeason(Integer.parseInt(topN), Integer.parseInt(season));
    }

}
