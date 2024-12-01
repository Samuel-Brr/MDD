package com.orion.mdd_api.services;

import com.orion.mdd_api.dtos.ArticleRecord;
import com.orion.mdd_api.dtos.CommentaireRecord;
import com.orion.mdd_api.entities.Article;
import com.orion.mdd_api.entities.Commentaire;
import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.repositories.ArticleRepository;
import com.orion.mdd_api.repositories.CommentaireRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private ThemeService themeService;

    @Mock
    private JwtService jwtService;

    @Mock
    private CommentaireRepository commentaireRepository;

    @InjectMocks
    private ArticleService articleService;

    private User testUser;
    private Theme testTheme;
    private Article testArticle;
    private Commentaire testComment;

    @BeforeEach
    void setUp() {
        // Initialize test data
        testUser = new User("testUser", "test@example.com", "password");
        testTheme = new Theme();
        testTheme.setId(1L);
        testTheme.setTitre("Test Theme");

        testArticle = new Article("Test Title", "Test Content", testUser, testTheme);
        testArticle.setId(1L);

        testComment = new Commentaire("Test Comment", testUser, testArticle);
        testComment.setId(1L);
    }

    @Nested
    @DisplayName("getArticleById Tests")
    class GetArticleByIdTests {

        @Test
        @DisplayName("Should successfully retrieve article by ID")
        void shouldRetrieveArticleById() {
            // Arrange
            when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

            // Act
            Article result = articleService.getArticleById(1L);

            // Assert
            assertNotNull(result);
            assertEquals(testArticle.getId(), result.getId());
            assertEquals(testArticle.getTitre(), result.getTitre());
            verify(articleRepository).findById(1L);
        }

        @Test
        @DisplayName("Should throw RuntimeException when article not found")
        void shouldThrowExceptionWhenArticleNotFound() {
            // Arrange
            when(articleRepository.findById(1L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(RuntimeException.class, () -> articleService.getArticleById(1L));
            verify(articleRepository).findById(1L);
        }
    }

    @Nested
    @DisplayName("getAllArticles Tests")
    class GetAllArticlesTests {

        @Test
        @DisplayName("Should return articles filtered by user's themes")
        void shouldReturnArticlesFilteredByUserThemes() {
            // Arrange
            List<Theme> userThemes = Arrays.asList(testTheme);
            List<Article> expectedArticles = Arrays.asList(testArticle);

            when(jwtService.getCurrentUser()).thenReturn(testUser);
            when(themeService.getThemesByUser(testUser)).thenReturn(userThemes);
            when(articleRepository.findByThemeIn(userThemes)).thenReturn(expectedArticles);

            // Act
            List<Article> result = articleService.getAllArticles();

            // Assert
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(testArticle.getId(), result.get(0).getId());
            verify(themeService).getThemesByUser(testUser);
            verify(articleRepository).findByThemeIn(userThemes);
        }

        @Test
        @DisplayName("Should return empty list when user has no themes")
        void shouldReturnEmptyListWhenUserHasNoThemes() {
            // Arrange
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            when(themeService.getThemesByUser(testUser)).thenReturn(List.of());
            when(articleRepository.findByThemeIn(List.of())).thenReturn(List.of());

            // Act
            List<Article> result = articleService.getAllArticles();

            // Assert
            assertNotNull(result);
            assertTrue(result.isEmpty());
            verify(themeService).getThemesByUser(testUser);
            verify(articleRepository).findByThemeIn(List.of());
        }
    }

    @Nested
    @DisplayName("addArticle Tests")
    class AddArticleTests {

        @Test
        @DisplayName("Should successfully add new article")
        void shouldAddNewArticle() {
            // Arrange
            ArticleRecord articleRecord = new ArticleRecord("Test Theme", "Test Title", "Test Content");
            when(themeService.getThemeByTitre("Test Theme")).thenReturn(testTheme);
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

            // Act
            Long result = articleService.addArticle(articleRecord);

            // Assert
            assertNotNull(result);
            assertEquals(testArticle.getId(), result);

            // Verify the saved article has correct properties
            ArgumentCaptor<Article> articleCaptor = ArgumentCaptor.forClass(Article.class);
            verify(articleRepository).save(articleCaptor.capture());
            Article savedArticle = articleCaptor.getValue();
            assertEquals(articleRecord.titre(), savedArticle.getTitre());
            assertEquals(articleRecord.contenu(), savedArticle.getContenu());
            assertEquals(testTheme, savedArticle.getTheme());
            assertEquals(testUser, savedArticle.getAuteur());
        }

        @Test
        @DisplayName("Should throw exception when theme not found")
        void shouldThrowExceptionWhenThemeNotFound() {
            // Arrange
            ArticleRecord articleRecord = new ArticleRecord("Invalid Theme", "Test Title", "Test Content");
            when(themeService.getThemeByTitre("Invalid Theme")).thenThrow(new RuntimeException("Theme not found"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> articleService.addArticle(articleRecord));
            verify(articleRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("addCommentaire Tests")
    class AddCommentaireTests {

        @Test
        @DisplayName("Should successfully add comment to article")
        void shouldAddCommentToArticle() {
            // Arrange
            CommentaireRecord commentRecord = new CommentaireRecord("Test Comment");
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
            when(commentaireRepository.save(any(Commentaire.class))).thenReturn(testComment);

            // Act
            Long result = articleService.addCommentaire(commentRecord, 1L);

            // Assert
            assertNotNull(result);
            assertEquals(testComment.getId(), result);

            // Verify the saved comment has correct properties
            ArgumentCaptor<Commentaire> commentCaptor = ArgumentCaptor.forClass(Commentaire.class);
            verify(commentaireRepository).save(commentCaptor.capture());
            Commentaire savedComment = commentCaptor.getValue();
            assertEquals(commentRecord.contenu(), savedComment.getContenu());
            assertEquals(testUser, savedComment.getAuteur());
            assertEquals(testArticle, savedComment.getArticle());
        }

        @Test
        @DisplayName("Should throw exception when article not found")
        void shouldThrowExceptionWhenArticleNotFoundForComment() {
            // Arrange
            CommentaireRecord commentRecord = new CommentaireRecord("Test Comment");
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            when(articleRepository.findById(1L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(RuntimeException.class, () -> articleService.addCommentaire(commentRecord, 1L));
            verify(commentaireRepository, never()).save(any());
        }
    }
}