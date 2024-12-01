package com.orion.mdd_api.repositories;

import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {
    public Optional<Theme> findByTitre(String titre);
    public List<Theme> findByAbonnesContains(User user);
}
