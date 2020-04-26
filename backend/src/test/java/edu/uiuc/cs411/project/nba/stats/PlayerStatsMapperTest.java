package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerSeasonStats;
import edu.uiuc.cs411.project.nba.stats.domain.PlayerStats;
import edu.uiuc.cs411.project.nba.stats.query.PlayerStatsMapper;
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
public class PlayerStatsMapperTest {

    @Autowired
    PlayerStatsMapper playerStatsMapper;

    @Test
    public void getOverall() {
        final PlayerStats stats = playerStatsMapper.getPlayerStatsOverallById(3);

        assertThat(stats).isNotNull();
        assertThat(stats.getAssists()).isEqualTo(30);
        assertThat(stats.getBlocks()).isEqualTo(30);
    }

    @Test
    public void getBySeason() {
        final PlayerStats stats_2018 = playerStatsMapper.getPlayerStatsBySeasonById(3, 2018);
        final PlayerStats stats_2019 = playerStatsMapper.getPlayerStatsBySeasonById(3, 2019);

        assertThat(stats_2018).isNotNull();
        assertThat(stats_2018.getAssists()).isEqualTo(10);
        assertThat(stats_2018.getBlocks()).isEqualTo(10);

        assertThat(stats_2019).isNotNull();
        assertThat(stats_2019.getAssists()).isEqualTo(20);
        assertThat(stats_2019.getBlocks()).isEqualTo(20);
    }

    @Test
    public void getGroupedBySeason() {
        List<PlayerSeasonStats> stats = playerStatsMapper.getPlayerStatsGroupedBySeason(3);

        assertThat(stats.get(0).getSeason()).isEqualTo(2018);
        assertThat(stats.get(0).getAssists()).isEqualTo(10);
        assertThat(stats.get(0).getBlocks()).isEqualTo(10);

        assertThat(stats.get(1).getSeason()).isEqualTo(2019);
        assertThat(stats.get(1).getAssists()).isEqualTo(20);
        assertThat(stats.get(1).getBlocks()).isEqualTo(20);
    }

    @Test
    public void getGame() {
        final PlayerStats stats = playerStatsMapper.getPlayerStatsByGameById(3, 100);

        assertThat(stats).isNotNull();
        assertThat(stats.getAssists()).isEqualTo(10);
        assertThat(stats.getBlocks()).isEqualTo(10);
    }

    @Test
    public void topAll() {
        final List<PlayerStats> stats = playerStatsMapper.topPlayerStats("Points", 2);

        assertThat(stats).isNotNull();
        assertThat(stats.get(0).getPlayer()).isEqualTo(2);
        assertThat(stats.get(1).getPlayer()).isEqualTo(3);
    }

    @Test
    public void topFranchise() {
        final List<PlayerStats> stats = playerStatsMapper.topPlayerStatsByFranchise(1001,"Points", 2);

        assertThat(stats.get(0).getPlayer()).isEqualTo(3);
        assertThat(stats.get(1).getPlayer()).isEqualTo(1);
    }

    @Test
    public void topGame() {
        final List<PlayerStats> stats = playerStatsMapper.topPlayerStatsByGame(100, "Points", 2);

        assertThat(stats.get(0).getPlayer()).isEqualTo(2);
        assertThat(stats.get(1).getPlayer()).isEqualTo(3);
    }

    @Test
    public void topSeason() {
        final List<PlayerStats> stats = playerStatsMapper.topPlayerStatsBySeason(2018, "Points", 2);


        System.out.println(stats);
        assertThat(stats.get(0).getPlayer()).isEqualTo(2);
        assertThat(stats.get(1).getPlayer()).isEqualTo(3);
    }
}
