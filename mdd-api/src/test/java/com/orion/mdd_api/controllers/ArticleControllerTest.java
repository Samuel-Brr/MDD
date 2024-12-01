package com.orion.mdd_api.controllers;

import com.orion.mdd_api.dtos.ArticleRecord;
import com.orion.mdd_api.dtos.CommentaireRecord;
import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.services.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleControllerTest {

    @Mock
    private ArticleService articleService;

    @InjectMocks
    private ArticleController articleController;

    private Article testArticle;
    private ArticleRecord testArticleRecord;
    private CommentaireRecord testCommentaireRecord;

    @BeforeEach
    void setUp() {
        // Initialize test data
        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitre("Test Article");
        testArticle.setContenu("Test Content");

        testArticleRecord = new ArticleRecord("Test Theme", "Test Title", "Test Content");
        testCommentaireRecord = new CommentaireRecord("Test Comment");
    }

    @Nested
    @DisplayName("getAllArticlesByUserId Tests")
    class GetAllArticlesByUserIdTests {

        @Test
        @DisplayName("Should return all articles for valid user ID")
        void shouldReturnAllArticlesForValidUserId() {
            // Arrange
            List<Article> articles = Arrays.asList(testArticle);
            when(articleService.getAllArticles()).thenReturn(articles);

            // Act
            ResponseEntity<ArticleController.ArticlesRecord> response =
                    articleController.getAllArticlesByUserId(1L);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(1, response.getBody().articles().size());
            assertEquals(testArticle.getId(), response.getBody().articles().get(0).getId());
            verify(articleService).getAllArticles();
        }

        @Test
        @DisplayName("Should handle empty article list")
        void shouldHandleEmptyArticleList() {
            // Arrange
            when(articleService.getAllArticles()).thenReturn(Collections.emptyList());

            // Act
            ResponseEntity<ArticleController.ArticlesRecord> response =
                    articleController.getAllArticlesByUserId(1L);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertTrue(response.getBody().articles().isEmpty());
            verify(articleService).getAllArticles();
        }

        @Test
        @DisplayName("Should handle service exception")
        void shouldHandleServiceException() {
            // Arrange
            when(articleService.getAllArticles())
                    .thenThrow(new RuntimeException("Test error"));

            // Act & Assert
            assertThrows(RuntimeException.class,
                    () -> articleController.getAllArticlesByUserId(1L));
            verify(articleService).getAllArticles();
        }
    }

    @Nested
    @DisplayName("createArticle Tests")
    class CreateArticleTests {

        @Test
        @DisplayName("Should successfully create article")
        void shouldCreateArticle() {
            // Arrange
            when(articleService.addArticle(any(ArticleRecord.class))).thenReturn(1L);

            // Act
            ResponseEntity<ArticleController.IdRecord> response =
                    articleController.createArticle(testArticleRecord);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(1L, response.getBody().id());
            verify(articleService).addArticle(testArticleRecord);
        }

        @Test
        @DisplayName("Should handle creation failure")
        void shouldHandleCreationFailure() {
            // Arrange
            when(articleService.addArticle(any(ArticleRecord.class)))
                    .thenThrow(new RuntimeException("Creation failed"));

            // Act & Assert
            assertThrows(RuntimeException.class,
                    () -> articleController.createArticle(testArticleRecord));
            verify(articleService).addArticle(testArticleRecord);
        }
    }

    @Nested
    @DisplayName("getArticleById Tests")
    class GetArticleByIdTests {

        @Test
        @DisplayName("Should return article for valid ID")
        void shouldReturnArticleForValidId() {
            // Arrange
            when(articleService.getArticleById(1L)).thenReturn(testArticle);

            // Act
            ResponseEntity<Article> response = articleController.getArticleById(1L);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(testArticle.getId(), response.getBody().getId());
            verify(articleService).getArticleById(1L);
        }

        @Test
        @DisplayName("Should handle article not found")
        void shouldHandleArticleNotFound() {
            // Arrange
            when(articleService.getArticleById(anyLong()))
                    .thenThrow(new RuntimeException("Article not found"));

            // Act & Assert
            assertThrows(RuntimeException.class,
                    () -> articleController.getArticleById(1L));
            verify(articleService).getArticleById(1L);
        }
    }

    @Nested
    @DisplayName("createCommentaire Tests")
    class CreateCommentaireTests {

        @Test
        @DisplayName("Should successfully create comment")
        void shouldCreateComment() {
            // Arrange
            when(articleService.addCommentaire(any(CommentaireRecord.class), anyLong()))
                    .thenReturn(1L);

            // Act
            ResponseEntity<ArticleController.IdRecord> response =
                    articleController.createCommentaire(testCommentaireRecord, 1L);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(1L, response.getBody().id());
            verify(articleService).addCommentaire(testCommentaireRecord, 1L);
        }

        @Test
        @DisplayName("Should handle comment creation failure")
        void shouldHandleCommentCreationFailure() {
            // Arrange
            when(articleService.addCommentaire(any(CommentaireRecord.class), anyLong()))
                    .thenThrow(new RuntimeException("Comment creation failed"));

            // Act & Assert
            assertThrows(RuntimeException.class,
                    () -> articleController.createCommentaire(testCommentaireRecord, 1L));
            verify(articleService).addCommentaire(testCommentaireRecord, 1L);
        }
    }
}