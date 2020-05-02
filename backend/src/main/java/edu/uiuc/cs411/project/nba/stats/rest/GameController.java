package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Game;
import edu.uiuc.cs411.project.nba.stats.query.GameMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

  private final GameMapper gameMapper;

  @Autowired
  public GameController(GameMapper gameMapper) {
    this.gameMapper = gameMapper;
  }

  @GetMapping(value = { "", "/" })
  public List<Game> getGamesByMonthYear(@RequestParam String month, @RequestParam String year) {
    return gameMapper.getGamesByMonthYear(Integer.parseInt(month), Integer.parseInt(year));
  }

  @GetMapping("/{id}")
  public Game fetchGameById(@PathVariable("id") String id) {
    return gameMapper.getGameById(Integer.parseInt(id));
  }

  @GetMapping("head-to-head")
  public List<Game> getGameBetweenFranchises(@RequestParam String franchise1, @RequestParam String franchise2,
      @RequestParam(required = false) String season) {
    int franchiseId1 = Integer.parseInt(franchise1);
    int franchiseId2 = Integer.parseInt(franchise2);
    if (!StringUtils.isEmpty(season)) {
      return gameMapper.getGamesBetweenFranchisesInSeason(franchiseId1, franchiseId2, Integer.parseInt(season));
    }
    return gameMapper.getGamesBetweenFranchises(franchiseId1, franchiseId2);
  }
}
