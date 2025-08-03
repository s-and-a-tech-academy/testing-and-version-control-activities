// --- Project Setup Instructions ---
// 1. Create a new folder for your project (e.g., "integration-testing-practice").
// 2. Open your terminal or command prompt, navigate into that folder.
// 3. Run: `npm init -y` (This creates a package.json file).
// 4. Run: `npm install --save-dev jest` (This installs Jest as a development dependency).
// 5. Open the `package.json` file and add the following line under "scripts":
//    "test": "jest" (add the --coverage flag if you want to generate a coverage report)
//    It should look something like this:
//    "scripts": {
//      "test": "jest"
//    },
// 6. Create a new file named `userManager.js` in your project folder.
// 7. Copy the content below for `userManager.js` into that file.
// 8. Create a new file named `userManager.test.js` in your project folder.
// 9. Copy the content below for `userManager.test.js` into that file.
// 10. To run the tests, open your terminal in the project folder and run: `npm test`

// --- File: userManager.js ---
// This file contains functions for a simple user login/registration system.

// A simple in-memory "database" to store user data (username: password)
// In a real application, this would be a proper database.
const _usersDb = {};

/**
 * Registers a new user.
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 * @returns {boolean} True if registration is successful, False otherwise (e.g., user already exists).
 * @throws {Error} If username or password are empty.
 */
function registerUser(username, password) {
  if (!username || !password) {
    throw new Error("Username and password cannot be empty.");
  }
  if (_usersDb[username]) {
    return false; // User already exists
  }
  _usersDb[username] = password;
  return true;
}

/**
 * Logs in an existing user.
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {boolean} True if login is successful, False otherwise (e.g., invalid credentials).
 */
function loginUser(username, password) {
  if (!_usersDb[username]) {
    return false; // User does not exist
  }
  return _usersDb[username] === password;
}

/**
 * Returns the number of registered users.
 * @returns {number} The number of registered users.
 */
function getUserCount() {
  return Object.keys(_usersDb).length;
}

/**
 * Clears all registered users from the in-memory database.
 * Useful for resetting state between tests.
 */
function clearUsers() {
  for (const key in _usersDb) {
    delete _usersDb[key];
  }
}

// Export the functions so they can be imported and tested
module.exports = {
  registerUser,
  loginUser,
  getUserCount,
  clearUsers
};


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
    beforeAll(() => {
        clearUsers();
        registerUser("validuser", "correctpass");
    });

    // Arrange
    const username = "validuser";
    const password = "correctpass";

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

// describe('Integration tests for user management', () => {
//     // Apprentices: Write tests that combine register and login here!
//     it('should allow login after successful registration', () => {
//         // Arrange
//         const username = "integrationUser";
//         const password = "integrationPass";
//         // Act: Register

//         // Act: Attempt to login
        

//         // Assert
       
//     });

//     // - Register a user, then try to log in with incorrect credentials
//     it('should fail login after registration with incorrect password', () => {
//         // Arrange
//         const username = "badLoginUser";
//         const password = "badLoginPass";
//         // Act: Register

//         // Act: Attempt to login with wrong password

//         // Assert
//     });
// });
