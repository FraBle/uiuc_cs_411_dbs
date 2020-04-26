package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Game;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseMapper;
import edu.uiuc.cs411.project.nba.stats.query.GameMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

  @GetMapping("/month/{month}/year/{year}")
  public List<Game> getGamesByMonthYear(@PathVariable("month") String month, @PathVariable("year") String year) {
    return gameMapper.getGamesByMonthYear(Integer.parseInt(month), Integer.parseInt(year));
  }
}
