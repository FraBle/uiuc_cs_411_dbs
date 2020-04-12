package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
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
public class PlayerMapperTest {

    @Autowired
    PlayerMapper playerMapper;

    @Test
    public void whenRecordsInDatabase_shouldReturnPlayerWithGivenId() {
        final Player player = playerMapper.getPlayerById(1, null);

        assertThat(player).isNotNull();
        assertThat(player.getName()).isEqualTo("Michael Jordan");
        assertThat(player.getPosition()).isEqualTo("F-G");
        assertThat(player.getHeight()).isEqualTo("6.6");
        assertThat(player.getWeight()).isEqualTo(216);
    }

    @Test
    public void count_shouldReturn_how_many_records_exists() {
        final Long count = playerMapper.count("");

        assertThat(count).isEqualTo(5);
    }

    @Test
    public void sort_players_by_name() {
        List<Player> players = playerMapper.fetchAll(5, 0, "Name", "ASC", "", null);
        assertThat(players.size()).isEqualTo(5);

        assertThat(players.get(0).getName()).isEqualTo("Kevin Durant");
        assertThat(players.get(1).getName()).isEqualTo("Kobe Bryant");
        assertThat(players.get(2).getName()).isEqualTo("LeBron James");
        assertThat(players.get(3).getName()).isEqualTo("Michael Jordan");
        assertThat(players.get(4).getName()).isEqualTo("Stephen Curry");
    }

    @Test
    public void sort_players_by_name_desc() {
        List<Player> players = playerMapper.fetchAll(5, 0, "Name", "DESC", "", null);
        assertThat(players.size()).isEqualTo(5);

        assertThat(players.get(0).getName()).isEqualTo("Stephen Curry");
        assertThat(players.get(1).getName()).isEqualTo("Michael Jordan");
        assertThat(players.get(2).getName()).isEqualTo("LeBron James");
        assertThat(players.get(3).getName()).isEqualTo("Kobe Bryant");
        assertThat(players.get(4).getName()).isEqualTo("Kevin Durant");
    }

    @Test
    public void pagination_test() {
        List<Player> players = playerMapper.fetchAll(3, 0, "Name", "ASC", "", null);
        assertThat(players.size()).isEqualTo(3);
        assertThat(players.get(0).getName()).isEqualTo("Kevin Durant");
        assertThat(players.get(1).getName()).isEqualTo("Kobe Bryant");
        assertThat(players.get(2).getName()).isEqualTo("LeBron James");

        players = playerMapper.fetchAll(3, 3, "Name", "ASC", "", null);
        assertThat(players.size()).isEqualTo(2);
        assertThat(players.get(0).getName()).isEqualTo("Michael Jordan");
        assertThat(players.get(1).getName()).isEqualTo("Stephen Curry");
    }

    @Test
    public void caseInsensitiveSearchTest() {
        List<Player> searchResult = playerMapper.fetchAll(50, 0, "Name", "ASC", "jOrDAn", null);
        assertThat(searchResult.size()).isEqualTo(1);

        assertThat(searchResult.get(0).getName()).isEqualTo("Michael Jordan");
    }

}
