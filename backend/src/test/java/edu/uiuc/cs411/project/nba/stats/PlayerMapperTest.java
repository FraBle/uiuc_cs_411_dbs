package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.PersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = PersistenceConfig.class)
public class PlayerMapperTest {

    @Autowired
    PlayerMapper playerMapper;

    @Test
    public void whenRecordsInDatabase_shouldReturnPlayerWithGivenId() {
        Player player = playerMapper.getPlayerById(203932);

        assertThat(player).isNotNull();
        assertThat(player.getName()).isEqualTo("Aaron Gordon");
        assertThat(player.getPosition()).isEqualTo("F");
    }

}
