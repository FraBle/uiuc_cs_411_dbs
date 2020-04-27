package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseMapper;
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
public class FranchiseMapperTest {

    @Autowired
    FranchiseMapper franchiseMapper;

    @Test
    public void countSearchAll() {
        Long count = franchiseMapper.count("");
        assertThat(count).isEqualTo(2);
    }

    @Test
    public void countSearchWithCity() {
        Long count = franchiseMapper.count("Golden");
        assertThat(count).isEqualTo(1);
    }

    @Test
    public void countSearchWithNickname() {
        Long count = franchiseMapper.count("Warriors");
        assertThat(count).isEqualTo(1);
    }

    @Test
    public void searchByCity() {
        List<Franchise> result = franchiseMapper.fetchAll(50, 0, "Nickname", "ASC", "", "Los Angeles");
        assertThat(result.size()).isEqualTo(1);
        assertThat(result.get(0).getNickname()).isEqualTo("Lakers");
    }

    @Test
    public void searchByNickname() {
        List<Franchise> result = franchiseMapper.fetchAll(50, 0, "Nickname", "ASC", "", "Warriors");
        assertThat(result.size()).isEqualTo(1);
        assertThat(result.get(0).getCity()).isEqualTo("Golden State");
    }

}
