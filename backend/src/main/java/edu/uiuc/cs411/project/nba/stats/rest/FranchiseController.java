package edu.uiuc.cs411.project.nba.stats.rest;

import edu.uiuc.cs411.project.nba.stats.domain.Franchise;
import edu.uiuc.cs411.project.nba.stats.domain.User;
import edu.uiuc.cs411.project.nba.stats.query.FranchiseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/franchise")
public class FranchiseController {

    private final FranchiseMapper franchiseMapper;

    @Autowired
    public FranchiseController(FranchiseMapper franchiseMapper) {
        this.franchiseMapper = franchiseMapper;
    }

    @GetMapping("/count")
    public Long count() {
        return franchiseMapper.count();
    }

    @GetMapping("/{id}")
    public Franchise fetchFranchiseById(@AuthenticationPrincipal User user, @PathVariable("id") String id) {
        return franchiseMapper.getFranchiseById(Integer.parseInt(id), user.getUsername());
    }

    @GetMapping(value = { "", "/"})
    public List<Franchise> fetchAllFranchises(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") String page,
            @RequestParam(defaultValue = "50") String pageSize,
            @RequestParam(defaultValue = "id") String order,
            @RequestParam(defaultValue = "ASC") String orderType
    ) {
        int pageAsInteger = Integer.parseInt(page);
        int pageSizeAsInteger = Integer.parseInt(pageSize);
        int offset = pageAsInteger == 1 ? 0 : (pageAsInteger - 1) * pageSizeAsInteger;
        String orderTypeValue = "DESC".equalsIgnoreCase(orderType) ? "DESC" : "ASC";

        return franchiseMapper.fetchAll(pageSizeAsInteger, offset, order, orderTypeValue, user.getUsername());
    }

}
