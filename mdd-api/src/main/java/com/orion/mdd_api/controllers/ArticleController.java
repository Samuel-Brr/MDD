package com.orion.mdd_api.controllers;

import com.orion.mdd_api.dtos.ArticleRecord;
import com.orion.mdd_api.dtos.CommentaireRecord;
import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.services.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsible for handling article-related operations.
 * This controller manages the creation, retrieval, and updating of article information.
 */
@RestController
@RequestMapping("/api/articles")
@Tag(name = "Article", description = "Article management API")
@SecurityRequirement(name = "Bearer Authentication")
@Validated
public class ArticleController {

    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @Operation(summary = "Get all articles", description = "Retrieves a list of all available articles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of articles",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = ArticlesRecord.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<ArticlesRecord> getAllArticles() {
        try {
            List<Article> articles = articleService.getAllArticles();
            logger.info("Retrieved {} articles", articles.size());
            return ResponseEntity.ok(new ArticlesRecord(articles));
        } catch (Exception e) {
            logger.error("Error retrieving all articles", e);
            throw new RuntimeException("An unexpected error occurred while retrieving articles", e);
        }
    }

    @Operation(summary = "Create a new article", description = "Creates a new article")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = IdRecord.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<IdRecord> createArticle(@Valid @RequestBody ArticleRecord articleRecord) {
        try {
            Long articleId = articleService.addArticle(articleRecord);
            logger.info("Created new article id: {}", articleId);
            return ResponseEntity.status(HttpStatus.OK).body(new IdRecord(articleId));
        } catch (Exception e) {
            logger.error("Error creating article: {}", articleRecord, e);
            throw new RuntimeException("An unexpected error occurred while creating the article", e);
        }
    }

    @Operation(summary = "Get a article by ID", description = "Retrieves a specific article by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the article",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Article.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Article> getRentalById(@PathVariable Long id) {
        try {
            Article article = articleService.getArticleById(id);
            logger.info("Retrieved article with id: {}", id);
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            logger.error("Error retrieving article with id: {}", id, e);
            throw new RuntimeException("An unexpected error occurred while retrieving the article", e);
        }
    }

    @Operation(summary = "Create a new article", description = "Creates a new article")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = IdRecord.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/{id}")
    public ResponseEntity<IdRecord> createCommentaire(@Valid @RequestBody CommentaireRecord commentaireRecord, @PathVariable Long id) {
        try {
            Long commentaireId = articleService.addCommentaire(commentaireRecord, id);
            logger.info("Created new commentaire id: {}", commentaireId);
            return ResponseEntity.status(HttpStatus.OK).body(new IdRecord(commentaireId));
        } catch (Exception e) {
            logger.error("Error creating commentaire: {}", commentaireRecord, e);
            throw new RuntimeException("An unexpected error occurred while creating the commentaire", e);
        }
    }

    public record ArticlesRecord(List<Article> articles) {
    }
    public record IdRecord(Long id) {
    }
}
