package com.orion.mdd_api.services;

import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.repositories.ThemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeService {
    private final ThemeRepository themeRepository;

    public ThemeService(ThemeRepository themeRepository) {
        this.themeRepository = themeRepository;
    }

    /**
     * Retrieves all themes.
     *
     * @return A list of all Theme entities.
     */
    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }

    /**
     * Retrieves a theme by its ID.
     *
     * @param titre The title of the theme to retrieve.
     * @return The Rental entity.
     * @throws RuntimeException if the theme is not found.
     */
    public Theme getThemeByTitre(String titre) {
        return themeRepository.findByTitre(titre)
                .orElseThrow(() -> new RuntimeException("Theme not found with titre: " + titre));
    }
}
