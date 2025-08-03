// --- File: userManager.test.js (Completed for Integration Test Example) ---
// This file contains comprehensive tests for the user manager system,
// including unit tests, integration tests, and demonstrations of mocking.

// Import the functions we need to test
const { registerUser, loginUser, getUserCount, clearUsers } = require('./userManager');

// Import the module containing the function we want to mock.
// Jest will automatically hoist jest.mock() calls to the top.
// This tells Jest to replace the actual 'sendWelcomeEmail' function
// from 'userManager' with a mock version.
jest.mock('./sendWelcomeEmail', () => ({
  sendWelcomeEmail: jest.fn(),
}));

// After mocking, we can now access the mocked function
// We need to import it specifically to interact with it as a mock
const { sendWelcomeEmail } = require('./sendWelcomeEmail');


// Use Jest's beforeEach to ensure the database is clear and mocks are reset before each test
beforeEach(() => {
  clearUsers();
  // Clear all mock calls and reset mock implementation before each test
  sendWelcomeEmail.mockClear();
});

describe('registerUser function with email notification', () => {
  test('should successfully register a new user and send a welcome email', () => {
    // Arrange
    const username = "newuser";
    const password = "securepassword";

    // Act
    const registrationSuccess = registerUser(username, password);

    // Assert
    expect(registrationSuccess).toBe(true);
    expect(getUserCount()).toBe(1);
    // Verify that sendWelcomeEmail was called exactly once
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    // Verify that sendWelcomeEmail was called with the correct username
    expect(sendWelcomeEmail).toHaveBeenCalledWith(username);
  });

  test('should not send a welcome email if registration fails (user already exists)', () => {
    // Arrange
    registerUser("existinguser", "pass"); // Register once
    sendWelcomeEmail.mockClear(); // Clear initial call for this specific test

    // Act
    const registrationSuccess = registerUser("existinguser", "pass"); // Attempt to register again

    // Assert
    expect(registrationSuccess).toBe(false); // Registration should fail
    expect(getUserCount()).toBe(1); // User count should remain 1
    // Verify that sendWelcomeEmail was NOT called again
    expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });

  test('should not send email if username is empty', () => {
    // Arrange & Act (expecting an error to be thrown)
    expect(() => registerUser("", "pass")).toThrow("Username and password cannot be empty.");

    // Assert that the email function was not called
    expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });

  // NEW STUBBING EXAMPLE
  test('should use a stub to return a predefined value from the email service', () => {
    // Arrange: We'll pretend our email service is having issues
    const errorMessage = "Email service is temporarily unavailable.";
    // Use `mockReturnValue` to stub the function with a specific return value
    sendWelcomeEmail.mockReturnValue(errorMessage);

    const username = "testuser";
    const password = "password123";

    // Act
    registerUser(username, password);

    // Assert
    // When we check the return value of the mocked function, it's the stubbed value.
    // The test `registerUser` calls `sendWelcomeEmail`, but doesn't use the return value.
    // So this test primarily demonstrates the setup of a stub.
    const resultFromMockedFunction = sendWelcomeEmail();
    expect(resultFromMockedFunction).toBe(errorMessage);
    // You could also imagine a different version of `registerUser`
    // that uses the return value and then you can test that logic.
  });
});

