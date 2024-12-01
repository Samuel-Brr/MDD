package com.orion.mdd_api.services;

import com.orion.mdd_api.entities.User;
import com.orion.mdd_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private JwtEncoder jwtEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private JwtService jwtService;

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_USERNAME = "testUser";
    private static final String TEST_TOKEN = "test.jwt.token";
    private static final String TEST_ISSUER = "test-issuer";
    private static final long TEST_EXPIRATION_HOURS = 24L;

    @BeforeEach
    void setUp() {
        // Set values for @Value annotations using reflection
        ReflectionTestUtils.setField(jwtService, "jwtIssuer", TEST_ISSUER);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationHours", TEST_EXPIRATION_HOURS);

        // Reset SecurityContextHolder before each test
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Token Generation Tests")
    class TokenGenerationTests {

        @Test
        @DisplayName("Should successfully generate token")
        void shouldGenerateToken() {
            // Arrange
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn(TEST_EMAIL);
            Jwt jwt = mock(Jwt.class);
            when(jwtEncoder.encode(any(JwtEncoderParameters.class)))
                    .thenReturn(new Jwt(TEST_TOKEN, Instant.now(), Instant.now().plusSeconds(3600),
                            Map.of("alg", "RS256"), Map.of("sub", TEST_EMAIL)));

            // Act
            String token = jwtService.generateToken(auth);

            // Assert
            assertNotNull(token);
            assertEquals(TEST_TOKEN, token);
            verify(jwtEncoder).encode(any(JwtEncoderParameters.class));
            verify(auth, times(3)).getName();
        }

        @Test
        @DisplayName("Should throw exception when encoder fails")
        void shouldThrowExceptionWhenEncoderFails() {
            // Arrange
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn(TEST_EMAIL);
            when(jwtEncoder.encode(any(JwtEncoderParameters.class)))
                    .thenThrow(new JwtEncodingException("Encoding failed"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> jwtService.generateToken(auth));
            verify(jwtEncoder).encode(any(JwtEncoderParameters.class));
        }
    }

    @Nested
    @DisplayName("Current User Retrieval Tests")
    class CurrentUserRetrievalTests {

        @Test
        @DisplayName("Should retrieve current user from valid JWT")
        void shouldRetrieveCurrentUserFromValidJwt() {
            // Arrange
            User expectedUser = new User(TEST_USERNAME, TEST_EMAIL, "password");
            JwtAuthenticationToken jwtAuth = mock(JwtAuthenticationToken.class);
            Jwt jwt = mock(Jwt.class);

            when(securityContext.getAuthentication()).thenReturn(jwtAuth);
            SecurityContextHolder.setContext(securityContext);
            when(jwtAuth.getPrincipal()).thenReturn(jwt);
            when(jwt.getSubject()).thenReturn(TEST_EMAIL);
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(expectedUser));

            // Act
            User user = jwtService.getCurrentUser();

            // Assert
            assertNotNull(user);
            assertEquals(TEST_EMAIL, user.getEmail());
            verify(userRepository).findByEmail(TEST_EMAIL);
        }

        @Test
        @DisplayName("Should throw exception when no JWT authentication found")
        void shouldThrowExceptionWhenNoJwtAuthenticationFound() {
            // Arrange
            Authentication nonJwtAuth = mock(Authentication.class);
            when(securityContext.getAuthentication()).thenReturn(nonJwtAuth);
            SecurityContextHolder.setContext(securityContext);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> jwtService.getCurrentUser());
            verify(userRepository, never()).findByEmail(any());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Arrange
            JwtAuthenticationToken jwtAuth = mock(JwtAuthenticationToken.class);
            Jwt jwt = mock(Jwt.class);

            when(securityContext.getAuthentication()).thenReturn(jwtAuth);
            SecurityContextHolder.setContext(securityContext);
            when(jwtAuth.getPrincipal()).thenReturn(jwt);
            when(jwt.getSubject()).thenReturn(TEST_EMAIL);
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(UsernameNotFoundException.class, () -> jwtService.getCurrentUser());
            verify(userRepository).findByEmail(TEST_EMAIL);
        }
    }

    @Nested
    @DisplayName("Current User From Authentication Tests")
    class CurrentUserFromAuthenticationTests {

        @Test
        @DisplayName("Should retrieve current user from valid authentication")
        void shouldRetrieveCurrentUserFromValidAuthentication() {
            // Arrange
            User expectedUser = new User(TEST_USERNAME, TEST_EMAIL, "password");
            Authentication auth = new UsernamePasswordAuthenticationToken(TEST_EMAIL, "password");
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(expectedUser));

            // Act
            User user = jwtService.getCurrentUser(auth);

            // Assert
            assertNotNull(user);
            assertEquals(TEST_EMAIL, user.getEmail());
            verify(userRepository).findByEmail(TEST_EMAIL);
        }

        @Test
        @DisplayName("Should throw exception when authentication type is invalid")
        void shouldThrowExceptionWhenAuthenticationTypeIsInvalid() {
            // Arrange
            Authentication invalidAuth = mock(Authentication.class);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> jwtService.getCurrentUser(invalidAuth));
            verify(userRepository, never()).findByEmail(any());
        }

        @Test
        @DisplayName("Should throw exception when user not found from authentication")
        void shouldThrowExceptionWhenUserNotFoundFromAuthentication() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(TEST_EMAIL, "password");
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(UsernameNotFoundException.class, () -> jwtService.getCurrentUser(auth));
            verify(userRepository).findByEmail(TEST_EMAIL);
        }
    }
}