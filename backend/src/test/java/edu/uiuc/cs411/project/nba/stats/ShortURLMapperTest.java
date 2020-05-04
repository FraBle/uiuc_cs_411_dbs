package edu.uiuc.cs411.project.nba.stats;

import edu.uiuc.cs411.project.nba.stats.config.DevPersistenceConfig;
import edu.uiuc.cs411.project.nba.stats.domain.ShortURL;
import edu.uiuc.cs411.project.nba.stats.query.ShortURLMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
@ContextConfiguration(classes = DevPersistenceConfig.class)
public class ShortURLMapperTest {

    @Autowired
    ShortURLMapper shortURLMapper;

    @Test
    public void insertURL() {
        String originalURL = "/player/name/example/id";
        Integer id = shortURLMapper.insert(new ShortURL(originalURL));
        assertNotNull(id);
        assertTrue(id != 0);

        ShortURL fetchedById = shortURLMapper.findById(id);
        assertEquals(originalURL, fetchedById.getUrl());
    }

    @Test
    public void fetchUrl() {
        String url = "/sup/url/to/make/short";
        assertNull(shortURLMapper.find(url));

        shortURLMapper.insert(new ShortURL(url));
        Integer result = shortURLMapper.find(url);
        assertNotNull(result);
        assertTrue(result != 0);
    }

}
