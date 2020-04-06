package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.query.FavoritesFranchiseMapper;
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
public class FavoritesFranchiseMapperTest {

    @Autowired
    FavoritesFranchiseMapper favoritesFranchiseMapper;

    @Test
    public void nonExistent_favorites_queries_test() {
        assertTrue(favoritesFranchiseMapper.franchiseIdsByUsername("nonExistentUser", 3, 0, 
                "Franchise",
                "ASC").isEmpty());
    }

    @Test
    public void existentFavorite_queries_test() {
        // Arrange
        favoritesFranchiseMapper.makeFavorite("zhe", 0);
        favoritesFranchiseMapper.makeFavorite("zhe", 1);

        // Act
        List<Integer> favoritedFranchiseIds = favoritesFranchiseMapper.franchiseIdsByUsername(
                "zhe", 3, 0,
                "Franchise",
                "ASC");

        // Assert
        assertEquals(favoritedFranchiseIds.get(0), 0);
        assertEquals(favoritedFranchiseIds.get(1), 1);
    }

    @Test
    public void makeFavorite__test() {
        boolean isFavorited;

        // Arrange
        favoritesFranchiseMapper.makeFavorite("zhe", 1);
        // Act
        isFavorited = favoritesFranchiseMapper.isFavorited("zhe", 1);
        // Assert
        assertTrue(isFavorited);

        // Arrange
        favoritesFranchiseMapper.deleteFavorite("zhe", 1);
        // Act
        isFavorited = favoritesFranchiseMapper.isFavorited("zhe", 1);
        // Assert
        assertFalse(isFavorited);
    }

}
