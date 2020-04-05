package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.Table;
import edu.uiuc.cs411.project.nba.stats.query.TableMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
@ContextConfiguration(classes = DevPersistenceConfig.class)
public class TableMapperTest {

    @Autowired
    TableMapper tableMapper;

    @Test
    public void whenRecordsInDatabase_shouldReturnTableWithGivenName() {
        final Table table = tableMapper.getTableByName("Player");

        assertThat(table).isNotNull();
        assertThat(table.getName()).isEqualTo("Player");
        assertThat(table.getnRows()).isEqualTo(5);
    }
}
