package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.query.FavoritesPlayerMapper;
import org.junit.jupiter.api.Test;
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
public class FavoritesPlayerMapperTest{

    @Autowired
    FavoritesPlayerMapper favoritesPlayerMapper;

    @Test
    public void nonExistent_favorites_queries_test() {
        assertTrue(favoritesPlayerMapper.playerIdsByUsername("nonExistentUser", 3, 0, "Player",
                "ASC").isEmpty());
    }

    @Test
    public void existentFavorite_queries_test() {
        // Arrange
        favoritesPlayerMapper.makeFavorite("zhe", 0);
        favoritesPlayerMapper.makeFavorite("zhe", 1);

        // Act
        List<Integer> favoritedPlayerIds = favoritesPlayerMapper.playerIdsByUsername("zhe", 3, 0,
                "Player",
                "ASC");

        // Assert
        assertEquals(favoritedPlayerIds.get(0), 0);
        assertEquals(favoritedPlayerIds.get(1), 1);
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
