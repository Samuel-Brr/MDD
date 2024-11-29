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
}
