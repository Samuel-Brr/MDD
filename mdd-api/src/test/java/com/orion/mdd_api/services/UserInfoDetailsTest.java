package com.orion.mdd_api.services;

import com.orion.mdd_api.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("UserInfoDetails Tests")
class UserInfoDetailsTest {

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "testPassword";
    private static final String TEST_USERNAME = "testUser";

    private User testUser;
    private UserInfoDetails userInfoDetails;

    @BeforeEach
    void setUp() {
        // Create a test User
        testUser = new User(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
        userInfoDetails = new UserInfoDetails(testUser);
    }

    @Test
    @DisplayName("Constructor should properly initialize with User entity")
    void constructorShouldInitializeCorrectly() {
        assertNotNull(userInfoDetails);
        assertEquals(TEST_EMAIL, userInfoDetails.getUsername());
        assertEquals(TEST_PASSWORD, userInfoDetails.getPassword());
    }

    @Nested
    @DisplayName("UserDetails Interface Implementation Tests")
    class UserDetailsInterfaceTests {

        @Test
        @DisplayName("getAuthorities should return empty list")
        void getAuthoritiesShouldReturnEmptyList() {
            Collection<? extends GrantedAuthority> authorities = userInfoDetails.getAuthorities();
            assertNotNull(authorities);
            assertTrue(authorities.isEmpty());
        }

        @Test
        @DisplayName("getPassword should return user's password")
        void getPasswordShouldReturnUserPassword() {
            assertEquals(TEST_PASSWORD, userInfoDetails.getPassword());
        }

        @Test
        @DisplayName("getUsername should return user's email")
        void getUsernameShouldReturnUserEmail() {
            assertEquals(TEST_EMAIL, userInfoDetails.getUsername());
        }

        @Test
        @DisplayName("isAccountNonExpired should return true")
        void isAccountNonExpiredShouldReturnTrue() {
            assertTrue(userInfoDetails.isAccountNonExpired());
        }

        @Test
        @DisplayName("isAccountNonLocked should return true")
        void isAccountNonLockedShouldReturnTrue() {
            assertTrue(userInfoDetails.isAccountNonLocked());
        }

        @Test
        @DisplayName("isCredentialsNonExpired should return true")
        void isCredentialsNonExpiredShouldReturnTrue() {
            assertTrue(userInfoDetails.isCredentialsNonExpired());
        }

        @Test
        @DisplayName("isEnabled should return true")
        void isEnabledShouldReturnTrue() {
            assertTrue(userInfoDetails.isEnabled());
        }
    }

    @Nested
    @DisplayName("Edge Cases Tests")
    class EdgeCasesTests {

        @Test
        @DisplayName("Constructor should handle null user")
        void constructorShouldHandleNullUser() {
            assertThrows(NullPointerException.class, () -> new UserInfoDetails(null));
        }

        @Test
        @DisplayName("Constructor should handle user with null email")
        void constructorShouldHandleNullEmail() {
            User userWithNullEmail = new User(TEST_USERNAME, null, TEST_PASSWORD);
            UserInfoDetails details = new UserInfoDetails(userWithNullEmail);
            assertNull(details.getUsername());
        }

        @Test
        @DisplayName("Constructor should handle user with null password")
        void constructorShouldHandleNullPassword() {
            User userWithNullPassword = new User(TEST_USERNAME, TEST_EMAIL, null);
            UserInfoDetails details = new UserInfoDetails(userWithNullPassword);
            assertNull(details.getPassword());
        }
    }
}