package com.orion.mdd_api.integration;

import com.orion.mdd_api.controllers.ArticleController;
import com.orion.mdd_api.dtos.*;
import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.entities.Commentaire;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ArticleIntegrationTest extends BaseIntegrationTest {

    @Test
    void shouldCreateAndRetrieveArticle() {
        // Login as regular user
        TokenAndIdRecord loginResult = login(regularUser.getEmail(), "user123!");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResult.token());

        // Create article
        ArticleRecord articleDto = new ArticleRecord(
                defaultTheme.getTitre(),
                "Test Article",
                "Test Content"
        );

        ResponseEntity<ArticleController.IdRecord> createResponse = restTemplate.exchange(
                baseUrl + "/articles",
                HttpMethod.POST,
                new HttpEntity<>(articleDto, headers),
                ArticleController.IdRecord.class
        );

        assertEquals(HttpStatus.OK, createResponse.getStatusCode());
        assertNotNull(createResponse.getBody());
        assertNotNull(createResponse.getBody().id());

        // Track for cleanup
        Long articleId = createResponse.getBody().id();
        trackCreatedEntity(Article.class, articleId);

        // Retrieve article
        ResponseEntity<Article> getResponse = restTemplate.exchange(
                baseUrl + "/articles/" + articleId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Article.class
        );

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNotNull(getResponse.getBody());
        assertEquals("Test Article", getResponse.getBody().getTitre());
        assertEquals("Test Content", getResponse.getBody().getContenu());
    }

    @Test
    void shouldListUserSubscribedArticles() {
        // Login as regular user
        TokenAndIdRecord loginResult = login(regularUser.getEmail(), "user123!");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResult.token());

        // Subscribe to theme first
        ResponseEntity<Void> subscribeResponse = restTemplate.exchange(
                baseUrl + "/themes/subscribe/" + defaultTheme.getId(),
                HttpMethod.POST,
                new HttpEntity<>(headers),
                Void.class
        );
        assertEquals(HttpStatus.OK, subscribeResponse.getStatusCode());

        // Create test article
        ArticleRecord articleDto = new ArticleRecord(
                defaultTheme.getTitre(),
                "Test Article",
                "Test Content"
        );

        ResponseEntity<ArticleController.IdRecord> createResponse = restTemplate.exchange(
                baseUrl + "/articles",
                HttpMethod.POST,
                new HttpEntity<>(articleDto, headers),
                ArticleController.IdRecord.class
        );
        trackCreatedEntity(Article.class, createResponse.getBody().id());

        // Get all articles
        ResponseEntity<ArticleController.ArticlesRecord> listResponse = restTemplate.exchange(
                baseUrl + "/articles/user/" + regularUser.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ArticleController.ArticlesRecord>() {
                }
        );

        assertEquals(HttpStatus.OK, listResponse.getStatusCode());
        assertNotNull(listResponse.getBody());
        assertTrue(listResponse.getBody().articles().stream()
                .anyMatch(a -> a.getTitre().equals("Test Article")));
    }

    @Test
    void shouldAddAndRetrieveComments() {
        // Login as regular user
        TokenAndIdRecord loginResult = login(regularUser.getEmail(), "user123!");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResult.token());

        // Create article first
        ArticleRecord articleDto = new ArticleRecord(
                defaultTheme.getTitre(),
                "Test Article",
                "Test Content"
        );

        ResponseEntity<ArticleController.IdRecord> articleResponse = restTemplate.exchange(
                baseUrl + "/articles",
                HttpMethod.POST,
                new HttpEntity<>(articleDto, headers),
                ArticleController.IdRecord.class
        );

        Long articleId = articleResponse.getBody().id();
        trackCreatedEntity(Article.class, articleId);

        // Add comment
        CommentaireRecord commentDto = new CommentaireRecord("Test Comment");

        ResponseEntity<ArticleController.IdRecord> commentResponse = restTemplate.exchange(
                baseUrl + "/articles/" + articleId,
                HttpMethod.POST,
                new HttpEntity<>(commentDto, headers),
                ArticleController.IdRecord.class
        );

        assertEquals(HttpStatus.OK, commentResponse.getStatusCode());
        assertNotNull(commentResponse.getBody());
        Long commentId = commentResponse.getBody().id();
        trackCreatedEntity(Commentaire.class, commentId);

        // Verify comment in article
        ResponseEntity<Article> getResponse = restTemplate.exchange(
                baseUrl + "/articles/" + articleId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Article.class
        );

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNotNull(getResponse.getBody());
    }
}