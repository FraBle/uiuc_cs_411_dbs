package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

public interface UserMapper {

    @Select("SELECT * FROM User WHERE username = #{username}")
    User findByUsername(String username);

    @Select("SELECT EXISTS(SELECT 1 FROM User WHERE username=#{username})")
    boolean existsByUsername(String username);

    @Select("SELECT EXISTS(SELECT 1 FROM User WHERE email=#{email})")
    boolean existsByEmail(String email);

    @Insert("INSERT INTO User(username, email, password) VALUES(#{username}, #{email}, #{password})")
    void save(User user);

    @Select("SELECT COUNT(*) FROM User")
    Long count();
}
