# Day 2 Extension: Mocks & Stubs in Integration Testing
This exercise introduces the concepts of mocks and stubs, essential tools for effective integration testing.

## Why do we need Mocks and Stubs?
In real-world applications, your software components rarely work in complete isolation. They often depend on:

**External services:** APIs, payment gateways, email services, cloud storage.

**Databases:** Actual database connections.

**Complex or slow components:** Parts of your own system that are computationally intensive or take a long time to run.

**Unreliable services:** Services that might not always be available during testing.

When you're writing integration tests, you want to test how your code interacts with its immediate dependencies. However, you often don't want your tests to:

- Actually send real emails to users.

- Make real financial transactions.

- Hit a slow external API every time you run a test.

- Rely on a database that might not be in a consistent state.

This is where Mocks and Stubs come in. They allow us to simulate the behavior of these dependencies.

## What are Mocks?
A mock is a dummy object that records calls made to it.

It allows you to verify that a specific method was called on the mock object, with specific arguments, and a certain number of times.

**Purpose:** To verify interactions – that your code correctly called a dependency.

## What are Stubs?
A stub is a dummy object that holds predefined data and uses it to answer calls during tests.

It provides canned answers to method calls made during the test, ensuring the test always gets a predictable response.

**Purpose:** To control the input or state that a dependency provides to the code being tested.

(Note: In many modern testing frameworks like Jest or Pytest, the terms "mock" and "stub" are often handled by the same mocking utility, blurring the lines. The key is understanding the purpose – controlling state vs. verifying interaction.)

## Scenario for Demonstration: User Registration with Email Notification
Let's enhance our userManager system. Imagine that after a user successfully registers, our system needs to send a welcome email. We don't want our tests to actually send emails.

Goal: Modify registerUser to "call" an email sending function, and then mock/stub that email sending function in our tests.

Code Examples & Step-by-Step Guide
JavaScript (Jest) Example
Step 1: Modify userManager.js

Add a new function sendWelcomeEmail and call it from registerUser. We'll make sendWelcomeEmail a separate export so we can mock or stub it.

// --- File: userManager.js (Updated) ---

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
  // Simulate sending a welcome email after successful registration
  sendWelcomeEmail(username); // <-- New line
  return true;
}

/**
 * Simulates sending a welcome email to a new user.
 * In a real app, this would interact with an email service.
 * @param {string} username - The username to send the email to.
 */
function sendWelcomeEmail(username) {
  // console.log(`[REAL EMAIL SERVICE]: Sending welcome email to ${username}`);
  // In a real application, this would involve API calls to an email service (e.g., SendGrid, Mailgun)
  // For now, it just logs, but we'll mock and stub it in tests.
  return `Email sent to ${username}`; // Return value for potential stubbing
}

function loginUser(username, password) {
  if (!_usersDb[username]) {
    return false; // User does not exist
  }
  return _usersDb[username] === password;
}

function getUserCount() {
  return Object.keys(_usersDb).length;
}

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
  clearUsers,
  sendWelcomeEmail // <-- New export for mocking/stubbing
};

Step 2: Modify userManager.test.js to Mock and Stub sendWelcomeEmail

We will use jest.fn() to create a mock, and then mockReturnValue() to stub a specific return value.

// --- File: userManager.test.js (Updated for Mocks & Stubs) ---

// Import the functions we need to test
const { registerUser, loginUser, getUserCount, clearUsers } = require('./userManager');

// Import the module containing the function we want to mock.
// Jest will automatically hoist jest.mock() calls to the top.
// This tells Jest to replace the actual 'sendWelcomeEmail' function
// from 'userManager' with a mock version.
jest.mock('./userManager', () => {
  // Get the actual module's exports
  const originalModule = jest.requireActual('./userManager');
  return {
    ...originalModule, // Export all original functions
    // Override sendWelcomeEmail with a mock function
    sendWelcomeEmail: jest.fn(), // <-- This is our mock!
  };
});

// After mocking, we can now access the mocked function
// We need to import it specifically to interact with it as a mock
const { sendWelcomeEmail } = require('./userManager');


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

// Continue with other tests for loginUser, etc., as before
// ... (Your existing loginUser tests can go here)
