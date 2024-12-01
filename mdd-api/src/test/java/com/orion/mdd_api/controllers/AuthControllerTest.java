package com.orion.mdd_api.controllers;

import com.orion.mdd_api.dtos.*;
import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.services.JwtService;
import com.orion.mdd_api.services.UserInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserInfoService userInfoService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private static final String TEST_USERNAME = "testUser";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "TestPass123!";
    private static final String TEST_TOKEN = "test.jwt.token";

    @BeforeEach
    void setUp() {
        // Common setup if needed
    }

    @Nested
    @DisplayName("Registration Tests")
    class RegistrationTests {

        @Test
        @DisplayName("Should successfully register new user")
        void shouldRegisterNewUser() {
            // Arrange
            Inscription inscription = new Inscription(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
            User expectedUser = new User(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
            Authentication mockAuth = mock(Authentication.class);


            when(userInfoService.addUser(any(User.class))).thenReturn(1L);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(mockAuth);
            when(mockAuth.isAuthenticated()).thenReturn(true);
            when(jwtService.generateToken(any(Authentication.class))).thenReturn(TEST_TOKEN);

            // Act
            ResponseEntity<AuthController.TokenDto> response = authController.register(inscription);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(TEST_TOKEN, response.getBody().token());

            // Verify user creation with correct data
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userInfoService).addUser(userCaptor.capture());
            User capturedUser = userCaptor.getValue();
            assertEquals(TEST_USERNAME, capturedUser.getName());
            assertEquals(TEST_EMAIL, capturedUser.getEmail());
            assertEquals(TEST_PASSWORD, capturedUser.getPassword());
        }

        @Test
        @DisplayName("Should handle registration failure")
        void shouldHandleRegistrationFailure() {
            // Arrange
            Inscription inscription = new Inscription(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
            when(userInfoService.addUser(any(User.class)))
                    .thenThrow(new RuntimeException("Registration failed"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> authController.register(inscription));
            verify(userInfoService).addUser(any(User.class));
            verify(jwtService, never()).generateToken(any());
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should successfully login user")
        void shouldLoginUser() {
            // Arrange
            Connexion connexion = new Connexion(TEST_EMAIL, TEST_PASSWORD);
            Authentication mockAuth = mock(Authentication.class);
            User mockUser = mock(User.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(mockAuth);
            when(mockAuth.isAuthenticated()).thenReturn(true);
            when(jwtService.generateToken(mockAuth)).thenReturn(TEST_TOKEN);
            when(jwtService.getCurrentUser(mockAuth)).thenReturn(mockUser);
            when(mockUser.getId()).thenReturn(1L);

            // Act
            ResponseEntity<?> response = authController.login(connexion);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertTrue(response.getBody() instanceof TokenAndIdRecord);
            TokenAndIdRecord tokenRecord = (TokenAndIdRecord) response.getBody();
            assertEquals(TEST_TOKEN, tokenRecord.token());
            assertEquals(1L, tokenRecord.id());
        }

        @Test
        @DisplayName("Should handle authentication failure")
        void shouldHandleAuthenticationFailure() {
            // Arrange
            Connexion connexion = new Connexion(TEST_EMAIL, TEST_PASSWORD);
            Authentication mockAuth = mock(Authentication.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(mockAuth);
            when(mockAuth.isAuthenticated()).thenReturn(false);

            // Act
            ResponseEntity<?> response = authController.login(connexion);

            // Assert
            assertEquals(401, response.getStatusCode().value());
            assertEquals("{\"message\": \"error\"}", response.getBody());
        }

        @Test
        @DisplayName("Should handle authentication exception")
        void shouldHandleAuthenticationException() {
            // Arrange
            Connexion connexion = new Connexion(TEST_EMAIL, TEST_PASSWORD);
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new RuntimeException("Authentication failed"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> authController.login(connexion));
        }
    }

    @Nested
    @DisplayName("User Credentials Tests")
    class UserCredentialsTests {

        @Test
        @DisplayName("Should get current user credentials")
        void shouldGetCurrentUserCredentials() {
            // Arrange
            User mockUser = mock(User.class);
            when(mockUser.getName()).thenReturn(TEST_USERNAME);
            when(mockUser.getEmail()).thenReturn(TEST_EMAIL);
            when(jwtService.getCurrentUser()).thenReturn(mockUser);

            // Act
            ResponseEntity<Credential> response = authController.getCurrentUser();

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertNotNull(response.getBody());
            assertEquals(TEST_USERNAME, response.getBody().username());
            assertEquals(TEST_EMAIL, response.getBody().email());
        }

        @Test
        @DisplayName("Should handle current user retrieval failure")
        void shouldHandleCurrentUserRetrievalFailure() {
            // Arrange
            when(jwtService.getCurrentUser())
                    .thenThrow(new RuntimeException("Failed to retrieve user"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> authController.getCurrentUser());
        }
    }

    @Nested
    @DisplayName("Update Credentials Tests")
    class UpdateCredentialsTests {

        @Test
        @DisplayName("Should update user credentials")
        void shouldUpdateUserCredentials() {
            // Arrange
            Credential newCredentials = new Credential(TEST_USERNAME, TEST_EMAIL);
            User mockUser = mock(User.class);
            Authentication mockAuth = mock(Authentication.class);
            UserDetails mockUserDetails = mock(UserDetails.class);

            when(jwtService.getCurrentUser()).thenReturn(mockUser);
            when(userInfoService.updateUser(mockUser, newCredentials)).thenReturn(1L);
            when(userInfoService.loadUserByUsername(TEST_EMAIL)).thenReturn(mockUserDetails);
            when(jwtService.generateToken(any(Authentication.class))).thenReturn(TEST_TOKEN);
            when(mockUser.getId()).thenReturn(1L);

            // Act
            ResponseEntity<?> response = authController.updateCurrentUser(newCredentials);

            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCode().value());
            assertTrue(response.getBody() instanceof CredsAndTokenRecord);
            CredsAndTokenRecord record = (CredsAndTokenRecord) response.getBody();
            assertEquals(TEST_USERNAME, record.username());
            assertEquals(TEST_EMAIL, record.email());
            assertEquals(TEST_TOKEN, record.token());
            assertEquals(1L, record.id());
        }

        @Test
        @DisplayName("Should handle update failure")
        void shouldHandleUpdateFailure() {
            // Arrange
            Credential newCredentials = new Credential(TEST_USERNAME, TEST_EMAIL);
            when(jwtService.getCurrentUser())
                    .thenThrow(new RuntimeException("Update failed"));

            // Act & Assert
            assertThrows(RuntimeException.class,
                    () -> authController.updateCurrentUser(newCredentials));
        }
    }
}