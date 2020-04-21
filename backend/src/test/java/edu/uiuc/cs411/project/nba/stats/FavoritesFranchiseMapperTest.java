package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.query.FavoritesFranchiseMapper;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
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

    @Autowired
    FranchiseMapper franchiseMapper;

    @Test
    public void nonExistent_favorites_queries_test() {
        assertTrue(favoritesFranchiseMapper.franchiseIdsByUsername("nonExistentUser", 3, 1, "ID", "ASC").isEmpty());
    }

    @Test
    public void existentFavorite_queries_test() {
        // Arrange
        favoritesFranchiseMapper.makeFavorite("zhe", 1);
        favoritesFranchiseMapper.makeFavorite("zhe", 2);

        // Act
        List<Franchise> favoritedFranchiseIds = favoritesFranchiseMapper.franchiseIdsByUsername("zhe", 3, 0, "ID", "ASC");

        // Assert
        assertEquals(favoritedFranchiseIds.get(0).getId(), franchiseMapper.getFranchiseById(1, "zhe").getId());
        assertEquals(favoritedFranchiseIds.get(1).getId(), franchiseMapper.getFranchiseById(2, "zhe").getId());
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
