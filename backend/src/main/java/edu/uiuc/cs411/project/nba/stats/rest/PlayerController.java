package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Player;
import edu.uiuc.cs411.project.nba.stats.query.PlayerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/player")
public class PlayerController {

    private final PlayerMapper playerMapper;

    @Autowired
    public PlayerController(PlayerMapper playerMapper) {
        this.playerMapper = playerMapper;
    }

    @GetMapping("/count")
    public Long count() {
        return playerMapper.count();
    }

    @GetMapping("/{id}")
    public Player fetchPlayerById(@PathVariable("id") String id) {
        return playerMapper.getPlayerById(Integer.parseInt(id));
    }

    @GetMapping("/player")
    public List<Player> fetchAllPlayers(
            @RequestParam(defaultValue = "1") String page,
            @RequestParam(defaultValue = "50") String pageSize,
            @RequestParam(defaultValue = "id") String order,
            @RequestParam(defaultValue = "ASC") String orderType
    ) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return playerMapper.fetchAll(pageSizeAsInteger, offset, order, orderTypeValue);
    }

}

