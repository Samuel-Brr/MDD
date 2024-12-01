package com.orion.mdd_api.services;

import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.repositories.ThemeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ThemeServiceTest {

    @Mock
    private ThemeRepository themeRepository;

    @InjectMocks
    private ThemeService themeService;

    @Test
    void testGetAllThemes() {
        List<Theme> themes = List.of(new Theme(), new Theme());
        when(themeRepository.findAll()).thenReturn(themes);

        List<Theme> result = themeService.getAllThemes();

        assertEquals(2, result.size());
        verify(themeRepository, times(1)).findAll();
    }

    @Test
    void testGetThemesByUser() {
        User user = new User();
        List<Theme> themes = List.of(new Theme(), new Theme());
        when(themeRepository.findByAbonnesContains(user)).thenReturn(themes);

        List<Theme> result = themeService.getThemesByUser(user);

        assertEquals(2, result.size());
        verify(themeRepository, times(1)).findByAbonnesContains(user);
    }

    @Test
    void testGetThemeByTitre() {
        String titre = "Test Theme";
        Theme theme = new Theme();
        when(themeRepository.findByTitre(titre)).thenReturn(Optional.of(theme));

        Theme result = themeService.getThemeByTitre(titre);

        assertNotNull(result);
        verify(themeRepository, times(1)).findByTitre(titre);
    }

    @Test
    void testGetThemeByTitreNotFound() {
        String titre = "Nonexistent Theme";
        when(themeRepository.findByTitre(titre)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            themeService.getThemeByTitre(titre);
        });

        assertEquals("Theme not found with titre: " + titre, exception.getMessage());
        verify(themeRepository, times(1)).findByTitre(titre);
    }

    @Test
    void testSubscribe() {
        Long themeId = 1L;
        User user = new User();
        Theme theme = new Theme();
        when(themeRepository.findById(themeId)).thenReturn(Optional.of(theme));

        themeService.subscribe(themeId, user);

        verify(themeRepository, times(1)).findById(themeId);
        verify(themeRepository, times(1)).save(theme);
    }

    @Test
    void testUnsubscribe() {
        Long themeId = 1L;
        User user = new User();
        Theme theme = new Theme();
        theme.addSubscriber(user);

        when(themeRepository.findById(themeId)).thenReturn(Optional.of(theme));

        themeService.unsubscribe(themeId, user);

        verify(themeRepository, times(1)).findById(themeId);
        verify(themeRepository, times(1)).save(theme);
    }
}