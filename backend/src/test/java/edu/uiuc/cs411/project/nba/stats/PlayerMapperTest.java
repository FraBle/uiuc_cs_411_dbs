package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.PersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.domain.Position;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = PersistenceConfig.class)
public class PlayerMapperTest {
 
    @Autowired
    PlayerMapper playerMapper;
 
    @Test
    public void whenRecordsInDatabase_shouldReturnPlayerWithGivenId() {
        UUID michaelJordanId = UUID.fromString("79085b3a-59fd-11ea-82b4-0242ac130003");
        Player player = playerMapper.getPlayerById(michaelJordanId);
 
        assertThat(player).isNotNull();
        assertThat(player.getFirstName()).isEqualTo("Michael");
        assertThat(player.getLastName()).isEqualTo("Jordan");
        assertThat(player.getPosition()).isEqualTo(Position.SG);
        assertThat(player.getHeight()).isEqualTo(6.6D);
        assertThat(player.getWeight()).isEqualTo(216D);
    }

}