// --- File: userManager.test.js ---
// This file is where apprentices will write tests for the user manager system.
const { registerUser, loginUser, getUserCount, clearUsers } = require('./userManager');

// --- Unit Tests for registerUser function ---
// Use Jest's beforeEach to ensure the database is clear before each test
describe('registerUser function', () => {
    beforeEach(() => {
        clearUsers();
    });

    // Arrange 
    const username = "testuser";
    const password = "password123";

    it('should successfully register a new user', () => {
        const result = registerUser(username, password); // Act

        expect(result).toBe(true); // Assert
        expect(getUserCount()).toBe(1); // Assert
    });

    it('should not register a user if username already exists', () => {
        // Arrange
        registerUser(username, password); // First registration (remember we clear users before each test)

        // Act: Attempt to register same user again
        const result = registerUser(username, password);

        expect(result).toBe(false); // Assert: Should fail
        expect(getUserCount()).toBe(1); // Assert: User count should remain 1
    });

    it('should throw an error if username is empty', () => {
        // Act & Assert
        expect(() => registerUser("", password)).toThrow("Username and password cannot be empty.");
        expect(getUserCount()).toBe(0); // Assert: No user should be added
    });

    it('should throw an error if password is empty', () => {
        // Act & Assert
        expect(() => registerUser(username, "")).toThrow("Username and password cannot be empty.");
        expect(getUserCount()).toBe(0); // Assert: No user should be added
    });

    it('should handle special characters in username and password', () => {
        const result = registerUser("user_123!@#", "P@ssw0rd!");
        expect(result).toBe(true);
        expect(getUserCount()).toBe(1);
    });
});

// --- Unit Tests for loginUser function ---
describe('loginUser function', () => {
    // Arrange
    const username = "validuser";
    const password = "correctpass";

    beforeAll(() => {
        clearUsers();
        registerUser(username, password);
    });

    it('should successfully log in with correct credentials', () => {
        const result = loginUser(username, password); // Act

        expect(result).toBe(true); // Assert
    });

    it('should fail login with incorrect password', () => {
        const result = loginUser(username, "wrongpass"); // Act

        expect(result).toBe(false); // Assert
    });

    it('should fail login with non-existent username', () => {
        // Arrange (no user registered)
        const result = loginUser("nonexistent", "anypass"); // Act
        expect(result).toBe(false); // Assert
    });

    it('should fail login with empty username', () => {
        // Arrange (no user registered)
        const result = loginUser("", password); // Act
        expect(result).toBe(false); // Assert
    });

    it('should fail login with empty password', () => {
        // Arrange
        const result = loginUser(username, ""); // Act 
        expect(result).toBe(false); // Assert 
    });
});

describe('Integration tests for user management', () => {
    // Apprentices: Write tests that combine register and login here!
    it('should allow login after successful registration', () => {
        // Arrange
        const username = "integrationUser";
        const password = "integrationPass";
        // Act: Register
        const registerSuccess = registerUser(username, password);
        // Act: Attempt to login
        const loginSuccess = loginUser(username, password);
        // Assert
        expect(registerSuccess).toBe(true);
        expect(loginSuccess).toBe(true);
        expect(getUserCount()).toBe(1);
    });

    // - Register a user, then try to log in with incorrect credentials
    it('should fail login after registration with incorrect password', () => {
        // Arrange
        const username = "badLoginUser";
        const password = "badLoginPass";
        // Act: Register

        // Act: Attempt to login with wrong password

        // Assert
    });
});