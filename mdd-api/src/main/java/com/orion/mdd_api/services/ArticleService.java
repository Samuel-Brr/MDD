package com.orion.mdd_api.services;

import com.orion.mdd_api.dtos.ArticleRecord;
import com.orion.mdd_api.dtos.CommentaireRecord;
import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.entities.Commentaire;
import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.repositories.ArticleRepository;
import com.orion.mdd_api.repositories.CommentaireRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service responsible for article-related operations.
 * This service handles the creation, retrieval, and update of article listings in the application.
 */
@Service
public class ArticleService {
    private static final Logger logger = LoggerFactory.getLogger(ArticleService.class);
    private final ArticleRepository articleRepository;
    private final ThemeService themeService;
    private final JwtService jwtService;
    private final CommentaireRepository commentaireRepository;

    public ArticleService(ArticleRepository articleRepository, ThemeService themeService, JwtService jwtService, CommentaireRepository commentaireRepository) {
        this.articleRepository = articleRepository;
        this.themeService = themeService;
        this.jwtService = jwtService;
        this.commentaireRepository = commentaireRepository;
    }

    /**
     * Retrieves an article by its ID.
     *
     * @param id The ID of the article to retrieve.
     * @return The Article entity.
     * @throws RuntimeException if the article is not found.
     */
    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
    }

    /**
     * Retrieves all articles.
     *
     * @return A list of all Article entities.
     */
    public List<Article> getAllArticles() {
        User currentUser = jwtService.getCurrentUser();
        List<Theme> themes = themeService.getThemesByUser(currentUser);
        return articleRepository.findByThemeIn(themes);
    }

    /**
     * Adds a new article.
     *
     * @param articleRecord The DTO containing the article details.
     * @return The created Article entity.
     */
    @Transactional
    public Long addArticle(ArticleRecord articleRecord) {
        logger.debug("Adding new article: {}", articleRecord);

        Theme theme = themeService.getThemeByTitre(articleRecord.theme());
        User user = jwtService.getCurrentUser();
        Article article = new Article(articleRecord.titre(), articleRecord.contenu(), user, theme);
        user.addArticle(article);
        theme.addArticle(article);
        Article savedArticle = articleRepository.save(article);
        logger.info("Article added successfully with ID: {}", savedArticle.getId());
        return savedArticle.getId();
    }

    /**
     * Adds a new commentaire.
     *
     * @param commentaireRecord The DTO containing the comment content.
     * @param articleId The id the article.
     * @return The created Article entity.
     */
    @Transactional
    public Long addCommentaire(CommentaireRecord commentaireRecord, Long articleId) {
        logger.debug("Adding new commentaire: {}", commentaireRecord);
        User user = jwtService.getCurrentUser();
        Article article = getArticleById(articleId);
        Commentaire commentaire = new Commentaire(commentaireRecord.contenu(), user, article);
        article.addCommentaire(commentaire);
        user.addCommentaire(commentaire);
        Commentaire savedCommentaire = commentaireRepository.save(commentaire);
        logger.info("Commentaire added successfully with ID: {}", savedCommentaire.getId());
        return savedCommentaire.getId();
    }
}
