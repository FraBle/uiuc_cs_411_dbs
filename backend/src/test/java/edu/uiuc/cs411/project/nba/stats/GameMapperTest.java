package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Game;
import edu.uiuc.cs411.project.nba.stats.query.GameMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
@ContextConfiguration(classes = DevPersistenceConfig.class)
public class GameMapperTest {

  @Autowired
  GameMapper gameMapper;

  @Test
  public void getByMonthYear() {
    final List<Game> games = gameMapper.getGamesByMonthYear(2, 2019);

    assertThat(games.size()).isEqualTo(2);
    assertThat(games.get(0).getId()).isEqualTo(101);
    assertThat(games.get(1).getId()).isEqualTo(102);
  }

  @Test
  public void gamesBetweenFranchises() {
    List<Game> games = gameMapper.getGamesBetweenFranchises(1, 2);

    assertThat(games.size()).isEqualTo(3);
  }

  @Test
  public void gamesBetweenFranchisesIntoSeason() {
    List<Game> games = gameMapper.getGamesBetweenFranchisesInSeason(1, 2, 2018);

    assertThat(games.size()).isEqualTo(1);
  }

}
