package com.orion.mdd_api.integration;

import com.orion.mdd_api.entities.*;
import com.orion.mdd_api.dtos.*;
import com.orion.mdd_api.repositories.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseIntegrationTest {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ThemeRepository themeRepository;

    @Autowired
    protected ArticleRepository articleRepository;

    @Autowired
    protected CommentaireRepository commentaireRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected String baseUrl;

    // Store test data references
    protected User adminUser;
    protected User regularUser;
    protected Theme defaultTheme;

    // Track created entities for cleanup
    private final ConcurrentHashMap<Class<?>, List<Long>> createdEntities = new ConcurrentHashMap<>();

    @BeforeAll
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        initializeTestData();
    }

    private void initializeTestData() {
        // Create admin user
        adminUser = new User("Admin", "admin@test.com", passwordEncoder.encode("admin123!"));
        adminUser = userRepository.save(adminUser);
        trackCreatedEntity(User.class, adminUser.getId());

        // Create regular user
        regularUser = new User("Regular", "user@test.com", passwordEncoder.encode("user123!"));
        regularUser = userRepository.save(regularUser);
        trackCreatedEntity(User.class, regularUser.getId());

        // Create default theme
        defaultTheme = new Theme();
        defaultTheme.setTitre("Default Theme");
        defaultTheme.setDescription("Test Theme Description");
        defaultTheme = themeRepository.save(defaultTheme);
        trackCreatedEntity(Theme.class, defaultTheme.getId());
    }

    @AfterAll
    void cleanup() {
        // Delete entities in reverse order of dependencies
        deleteTrackedEntities(Commentaire.class);
        deleteTrackedEntities(Article.class);
        deleteTrackedEntities(Theme.class);
        deleteTrackedEntities(User.class);

        // Clear tracking maps
        createdEntities.clear();
    }

    protected void trackCreatedEntity(Class<?> entityClass, Long entityId) {
        createdEntities.computeIfAbsent(entityClass, k -> new ArrayList<>()).add(entityId);
    }

    private void deleteTrackedEntities(Class<?> entityClass) {
        List<Long> ids = createdEntities.getOrDefault(entityClass, new ArrayList<>());
        for (Long id : ids) {
            try {
                if (entityClass == User.class) {
                    userRepository.deleteById(id);
                } else if (entityClass == Theme.class) {
                    themeRepository.deleteById(id);
                } else if (entityClass == Article.class) {
                    articleRepository.deleteById(id);
                } else if (entityClass == Commentaire.class) {
                    commentaireRepository.deleteById(id);
                }
            } catch (Exception e) {
                System.err.println("Error deleting entity of type " + entityClass + " with id " + id + ": " + e.getMessage());
            }
        }
    }

    // Helper method for logging in
    protected TokenAndIdRecord login(String email, String password) {
        Connexion loginRequest = new Connexion(email, password);

        ResponseEntity<TokenAndIdRecord> response = restTemplate.postForEntity(
                baseUrl + "/auth/login",
                loginRequest,
                TokenAndIdRecord.class
        );

        if (response.getBody() == null) {
            throw new RuntimeException("Failed to login with email: " + email);
        }

        return response.getBody();
    }
}