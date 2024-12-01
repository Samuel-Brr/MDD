package com.orion.mdd_api.integration;

import com.orion.mdd_api.controllers.AuthController;
import com.orion.mdd_api.dtos.*;
import com.orion.mdd_api.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.*;

import static org.junit.jupiter.api.Assertions.*;

class AuthIntegrationTest extends BaseIntegrationTest {

    @Test
    void shouldRegisterLoginAndUpdateUser() {
        // Register new user
        Inscription registerRequest = new Inscription(
                "testuser",
                "test@example.com",
                "Test123!"
        );

        ResponseEntity<AuthController.TokenDto> registerResponse = restTemplate.postForEntity(
                baseUrl + "/auth/register",
                registerRequest,
                AuthController.TokenDto.class
        );

        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
        assertNotNull(registerResponse.getBody());
        assertNotNull(registerResponse.getBody().token());

        // Login with new user
        TokenAndIdRecord loginResult = login("test@example.com", "Test123!");
        assertNotNull(loginResult.token());
        assertNotNull(loginResult.id());

        // Update user credentials
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResult.token());

        Credential updateRequest = new Credential(
                "updateduser",
                "updated@example.com"
        );

        ResponseEntity<CredsAndTokenRecord> updateResponse = restTemplate.exchange(
                baseUrl + "/auth/credentials",
                HttpMethod.PUT,
                new HttpEntity<>(updateRequest, headers),
                CredsAndTokenRecord.class
        );

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertNotNull(updateResponse.getBody());
        assertEquals("updateduser", updateResponse.getBody().username());
        assertEquals("updated@example.com", updateResponse.getBody().email());

        // Verify can login with updated credentials
        TokenAndIdRecord newLoginResult = login("updated@example.com", "Test123!");
        assertNotNull(newLoginResult.token());

        trackCreatedEntity(User.class, updateResponse.getBody().id());
    }

    @Test
    void shouldNotLoginWithInvalidCredentials() {
        ResponseEntity<TokenAndIdRecord> response = restTemplate.postForEntity(
                baseUrl + "/auth/login",
                new Connexion("wrong@email.com", "wrongpass"),
                TokenAndIdRecord.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void shouldGetCurrentUserCredentials() {
        // First login
        TokenAndIdRecord loginResult = login(regularUser.getEmail(), "user123!");

        // Get credentials
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResult.token());

        ResponseEntity<Credential> response = restTemplate.exchange(
                baseUrl + "/auth/credentials",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Credential.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(regularUser.getEmail(), response.getBody().email());
    }

    @Test
    void shouldNotAccessProtectedEndpointsWithoutToken() {
        ResponseEntity<Credential> response = restTemplate.exchange(
                baseUrl + "/auth/credentials",
                HttpMethod.GET,
                HttpEntity.EMPTY,
                Credential.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}