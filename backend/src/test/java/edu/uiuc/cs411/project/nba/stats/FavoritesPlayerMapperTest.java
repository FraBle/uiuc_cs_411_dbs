package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.query.FavoritesPlayerMapper;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
import org.junit.jupiter.api.Test;
import edu.uiuc.cs411.project.nba.stats.domain.Player;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
@ContextConfiguration(classes = DevPersistenceConfig.class)
public class FavoritesPlayerMapperTest {

    @Autowired
    FavoritesPlayerMapper favoritesPlayerMapper;

    @Autowired
    PlayerMapper playerMapper;

    @Test
    public void nonExistent_favorites_queries_test() {
        assertTrue(favoritesPlayerMapper.playerIdsByUsername("nonExistentUser", 3, 1, "ID", "ASC").isEmpty());
    }

    @Test
    public void existentFavorite_queries_test() {
        // Arrange
        favoritesPlayerMapper.makeFavorite("zhe", 1);
        favoritesPlayerMapper.makeFavorite("zhe", 2);

        // Act
        List<Player> favoritedPlayerIds = favoritesPlayerMapper.playerIdsByUsername("zhe", 3, 0, "ID", "ASC");

        // Assert
        assertEquals(favoritedPlayerIds.get(0).getId(), playerMapper.getPlayerById(1, "zhe").getId());
        assertEquals(favoritedPlayerIds.get(1).getId(), playerMapper.getPlayerById(2, "zhe").getId());
    }

    @Test
    public void makeFavorite__test() {
        boolean isFavorited;

        // Arrange
        favoritesPlayerMapper.makeFavorite("zhe", 1);
        // Act
        isFavorited = favoritesPlayerMapper.isFavorited("zhe", 1);
        // Assert
        assertTrue(isFavorited);

        // Arrange
        favoritesPlayerMapper.deleteFavorite("zhe", 1);
        // Act
        isFavorited = favoritesPlayerMapper.isFavorited("zhe", 1);
        // Assert
        assertFalse(isFavorited);
    }

}
