package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.FranchiseWins;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseStatsMapper;
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
public class FranchiseStatsMapperTest {

    @Autowired
    FranchiseStatsMapper franchiseStatsMapper;

    @Test
    public void getFranchiseWins() {
        FranchiseWins franchiseWins = franchiseStatsMapper.getFranchiseWins(1);

        assertThat(franchiseWins.getFranchise()).isEqualTo(1);
        assertThat(franchiseWins.getVictories()).isEqualTo(2);

        franchiseWins = franchiseStatsMapper.getFranchiseWins(2);

        assertThat(franchiseWins.getFranchise()).isEqualTo(2);
        assertThat(franchiseWins.getVictories()).isEqualTo(1);
    }

    @Test
    public void getTop1FranchiseByVictories() {
        List<FranchiseWins> top = franchiseStatsMapper.getTopFranchiseByVictories(1);
        assertThat(top.size()).isEqualTo(1);
        assertThat(top.get(0).getFranchise()).isEqualTo(1);
        assertThat(top.get(0).getVictories()).isEqualTo(2);
    }

    @Test
    public void getTop2FranchiseByVictories() {
        List<FranchiseWins> top = franchiseStatsMapper.getTopFranchiseByVictories(2);
        assertThat(top.size()).isEqualTo(2);

        assertThat(top.get(1).getFranchise()).isEqualTo(2);
        assertThat(top.get(1).getVictories()).isEqualTo(1);
    }

    @Test
    public void getFranchiseWinsOnSeason() {
        FranchiseWins franchiseWins = franchiseStatsMapper.getFranchiseWinsBySeason(1, 2019);

        assertThat(franchiseWins.getFranchise()).isEqualTo(1);
        assertThat(franchiseWins.getVictories()).isEqualTo(1);
    }

    @Test
    public void getTop2FranchiseByVictoriesOnSeason() {
        List<FranchiseWins> top = franchiseStatsMapper.getTopFranchiseByVictoriesOnSeason(2, 2019);
        assertThat(top.size()).isEqualTo(2);

        assertThat(top.get(0).getFranchise()).isEqualTo(1);
        assertThat(top.get(0).getVictories()).isEqualTo(1);

        assertThat(top.get(1).getFranchise()).isEqualTo(2);
        assertThat(top.get(1).getVictories()).isEqualTo(1);
    }

}
