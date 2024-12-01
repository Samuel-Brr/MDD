package com.orion.mdd_api.controllers;

import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.services.JwtService;
import com.orion.mdd_api.services.ThemeService;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ThemeControllerTest {

    @Mock
    private ThemeService themeService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private ThemeController themeController;

    private User testUser;
    private Theme testTheme1;
    private Theme testTheme2;

    @BeforeEach
    void setUp() {
        testUser = new User("testUser", "test@example.com", "password");

        testTheme1 = new Theme();
        testTheme1.setId(1L);
        testTheme1.setTitre("Java");
        testTheme1.setDescription("Java Programming");

        testTheme2 = new Theme();
        testTheme2.setId(2L);
        testTheme2.setTitre("Spring");
        testTheme2.setDescription("Spring Framework");
    }

    @Nested
    @DisplayName("getAllThemes Tests")
    class GetAllThemesTests {

        @Test
        @DisplayName("Should successfully retrieve all themes")
        void shouldRetrieveAllThemes() {
            // Arrange
            List<Theme> themes = Arrays.asList(testTheme1, testTheme2);
            when(themeService.getAllThemes()).thenReturn(themes);

            // Act
            ResponseEntity<ThemeController.ThemesRecord> response = themeController.getAllThemes();

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().themes().size());
            verify(themeService).getAllThemes();
        }

        @Test
        @DisplayName("Should handle empty theme list")
        void shouldHandleEmptyThemeList() {
            // Arrange
            when(themeService.getAllThemes()).thenReturn(Collections.emptyList());

            // Act
            ResponseEntity<ThemeController.ThemesRecord> response = themeController.getAllThemes();

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().themes().isEmpty());
            verify(themeService).getAllThemes();
        }

        @Test
        @DisplayName("Should handle service exception")
        void shouldHandleServiceException() {
            // Arrange
            when(themeService.getAllThemes()).thenThrow(new RuntimeException("Test error"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> themeController.getAllThemes());
            verify(themeService).getAllThemes();
        }
    }

    @Nested
    @DisplayName("subscribe Tests")
    class SubscribeTests {

        @Test
        @DisplayName("Should successfully subscribe to theme")
        void shouldSubscribeToTheme() {
            // Arrange
            Long themeId = 1L;
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            doNothing().when(themeService).subscribe(themeId, testUser);

            // Act
            ResponseEntity<?> response = themeController.subscribe(themeId);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            verify(jwtService).getCurrentUser();
            verify(themeService).subscribe(themeId, testUser);
        }

        @Test
        @DisplayName("Should handle subscription error")
        void shouldHandleSubscriptionError() {
            // Arrange
            Long themeId = 1L;
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            doThrow(new RuntimeException("Subscription failed")).when(themeService).subscribe(themeId, testUser);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> themeController.subscribe(themeId));
            verify(jwtService).getCurrentUser();
            verify(themeService).subscribe(themeId, testUser);
        }
    }

    @Nested
    @DisplayName("unsubscribe Tests")
    class UnsubscribeTests {

        @Test
        @DisplayName("Should successfully unsubscribe from theme")
        void shouldUnsubscribeFromTheme() {
            // Arrange
            Long themeId = 1L;
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            doNothing().when(themeService).unsubscribe(themeId, testUser);

            // Act
            ResponseEntity<?> response = themeController.unsubscribe(themeId);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            verify(jwtService).getCurrentUser();
            verify(themeService).unsubscribe(themeId, testUser);
        }

        @Test
        @DisplayName("Should handle unsubscription error")
        void shouldHandleUnsubscriptionError() {
            // Arrange
            Long themeId = 1L;
            when(jwtService.getCurrentUser()).thenReturn(testUser);
            doThrow(new RuntimeException("Unsubscription failed")).when(themeService).unsubscribe(themeId, testUser);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> themeController.unsubscribe(themeId));
            verify(jwtService).getCurrentUser();
            verify(themeService).unsubscribe(themeId, testUser);
        }
    }

    @Nested
    @DisplayName("Error Handling Tests")
    class ErrorHandlingTests {

        @Test
        @DisplayName("Should handle JwtService failure")
        void shouldHandleJwtServiceFailure() {
            // Arrange
            Long themeId = 1L;
            when(jwtService.getCurrentUser()).thenThrow(new RuntimeException("JWT error"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> themeController.subscribe(themeId));
            verify(jwtService).getCurrentUser();
            verify(themeService, never()).subscribe(any(), any());
        }
    }
}