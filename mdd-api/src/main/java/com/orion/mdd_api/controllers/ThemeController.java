package com.orion.mdd_api.controllers;

import com.orion.mdd_api.entities.Theme;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.services.JwtService;
import com.orion.mdd_api.services.ThemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsible for handling theme-related operations.
 * This controller manages the retrieval of theme information.
 */
@RestController
@RequestMapping("/api/themes")
@Tag(name = "Themes", description = "Themes management API")
@SecurityRequirement(name = "Bearer Authentication")
@Validated
public class ThemeController {
    private static final Logger logger = LoggerFactory.getLogger(ThemeController.class);
    private final ThemeService themeService;
    private final JwtService jwtService;

    public ThemeController(ThemeService themeService, JwtService jwtService) {
        this.themeService = themeService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Get all themes", description = "Retrieves a list of all available themes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of themes",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = ThemesRecord.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<ThemesRecord> getAllThemes() {
        try {
            List<Theme> themes = themeService.getAllThemes();
            logger.info("Retrieved {} themes", themes.size());
            return ResponseEntity.ok(new ThemesRecord(themes));
        } catch (Exception e) {
            logger.error("Error retrieving all themes", e);
            throw new RuntimeException("An unexpected error occurred while retrieving themes", e);
        }
    }

    @Operation(summary = "Subscribes to a theme", description = "Subscribes the current user to a theme")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully subscribed to theme"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/subscribe/{themeId}")
    public ResponseEntity subscribe(@Valid @PathVariable Long themeId) {
        try {
            User currentUser = jwtService.getCurrentUser();
            themeService.subscribe(themeId, currentUser);
            logger.info("Subscribed successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error subscribing", e);
            throw new RuntimeException("An unexpected error occurred while subscribing", e);
        }
    }

    @Operation(summary = "Unsubscribes to a theme", description = "Unsubscribes the current user to a theme")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully unsubscribed to theme"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/unsubscribe/{themeId}")
    public ResponseEntity unsubscribe(@Valid @PathVariable Long themeId) {
        try {
            User currentUser = jwtService.getCurrentUser();
            themeService.unsubscribe(themeId, currentUser);
            logger.info("Unsubscribed successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error unsubscribing", e);
            throw new RuntimeException("An unexpected error occurred while unsubscribing", e);
        }
    }

    public record ThemesRecord(List<Theme> themes) {}
}

