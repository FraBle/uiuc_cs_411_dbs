package edu.uiuc.cs411.project.nba.stats.query;

import edu.uiuc.cs411.project.nba.stats.domain.ShortURL;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

public interface ShortURLMapper {

    @Select("SELECT id FROM ShortURL WHERE url = #{url}")
    Integer find(String url);

    @Select("SELECT * FROM ShortURL WHERE id = #{id}")
    ShortURL findById(Integer id);

    @Insert("INSERT INTO ShortURL(url) values (#{url})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ShortURL shortURL);

}
