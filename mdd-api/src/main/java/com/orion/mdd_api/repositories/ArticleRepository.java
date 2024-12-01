package com.orion.mdd_api.repositories;

import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.entities.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    public List<Article> findByThemeIn(List<Theme> themes);
}
