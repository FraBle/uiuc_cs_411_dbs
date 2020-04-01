package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.User;
import edu.uiuc.cs411.project.nba.stats.query.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
@ContextConfiguration(classes = DevPersistenceConfig.class)
public class UserMapperTest {

    @Autowired
    UserMapper userMapper;

    @Test
    public void nonExistentUser_queries_test() {
        assertNull(userMapper.findByUsername("nonExistentUser"));
        assertFalse(userMapper.existsByUsername("nonExistentUser"));
        assertFalse(userMapper.existsByEmail("nonExistent@email.com"));
    }

    @Test
    public void existentUser_queries_test() {
        // Arrange
        User user = new User("gabe", "gabrielsuch@gmail.com", "password123");
        userMapper.save(user);

        // Act
        User fetchedUser = userMapper.findByUsername("gabe");

        // Assert
        assertNotNull(fetchedUser);
        assertEquals("gabe", fetchedUser.getUsername());
        assertEquals("gabrielsuch@gmail.com", fetchedUser.getEmail());
        assertEquals("password123", fetchedUser.getPassword());

        assertTrue(userMapper.existsByUsername("gabe"));
        assertTrue(userMapper.existsByEmail("gabrielsuch@gmail.com"));
    }

}
