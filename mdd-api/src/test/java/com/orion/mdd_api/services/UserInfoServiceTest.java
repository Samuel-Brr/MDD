package com.orion.mdd_api.services;

import com.orion.mdd_api.dtos.Credential;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserInfoServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserInfoService userInfoService;

    private User testUser;
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password123";
    private static final String TEST_USERNAME = "testUser";
    private static final String ENCODED_PASSWORD = "encodedPassword123";

    @BeforeEach
    void setUp() {
        testUser = new User(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
        testUser.setId(1L);
    }

    @Nested
    @DisplayName("loadUserByUsername Tests")
    class LoadUserByUsernameTests {

        @Test
        @DisplayName("Should successfully load user by username")
        void shouldLoadUserByUsername() {
            // Arrange
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

            // Act
            UserDetails userDetails = userInfoService.loadUserByUsername(TEST_EMAIL);

            // Assert
            assertNotNull(userDetails);
            assertEquals(TEST_EMAIL, userDetails.getUsername());
            verify(userRepository).findByEmail(TEST_EMAIL);
        }

        @Test
        @DisplayName("Should throw UsernameNotFoundException when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Arrange
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(UsernameNotFoundException.class,
                    () -> userInfoService.loadUserByUsername(TEST_EMAIL));
            verify(userRepository).findByEmail(TEST_EMAIL);
        }
    }

    @Nested
    @DisplayName("addUser Tests")
    class AddUserTests {

        @Test
        @DisplayName("Should successfully add new user")
        void shouldAddNewUser() {
            // Arrange
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            Long userId = userInfoService.addUser(testUser);

            // Assert
            assertNotNull(userId);
            verify(passwordEncoder).encode(TEST_PASSWORD);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when adding user with existing email")
        void shouldThrowExceptionForDuplicateEmail() {
            // Arrange
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> userInfoService.addUser(testUser));
            verify(userRepository).findByEmail(TEST_EMAIL);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should encode password when adding user")
        void shouldEncodePasswordWhenAddingUser() {
            // Arrange
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userInfoService.addUser(testUser);

            // Assert
            verify(passwordEncoder).encode(TEST_PASSWORD);
            verify(userRepository).save(argThat(user ->
                    user.getPassword().equals(ENCODED_PASSWORD)
            ));
        }
    }

    @Nested
    @DisplayName("updateUser Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("Should successfully update user")
        void shouldUpdateUser() {
            // Arrange
            Credential credential = new Credential(TEST_USERNAME, TEST_EMAIL);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            Long userId = userInfoService.updateUser(testUser, credential);

            // Assert
            assertNotNull(userId);
            assertEquals(TEST_USERNAME, testUser.getName());
            assertEquals(TEST_EMAIL, testUser.getEmail());
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should update only allowed fields")
        void shouldUpdateOnlyAllowedFields() {
            // Arrange
            String originalPassword = testUser.getPassword();
            Credential credential = new Credential("newUsername", "new@example.com");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userInfoService.updateUser(testUser, credential);

            // Assert
            assertEquals("newUsername", testUser.getName());
            assertEquals("new@example.com", testUser.getEmail());
            assertEquals(originalPassword, testUser.getPassword());
            verify(userRepository).save(testUser);
        }
    }
}