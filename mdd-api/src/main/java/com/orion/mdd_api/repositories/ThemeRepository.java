package com.orion.mdd_api.repositories;

import com.orion.mdd_api.entities.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {
    public Optional<Theme> findByTitre(String titre);
}
