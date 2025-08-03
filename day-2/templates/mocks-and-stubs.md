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

## Code Examples & Step-by-Step Guide
JavaScript (Jest) Example
### Step 1: Create sendWelcomeEmail.js
Create a new file in your `integration-testing-practice` directory called `sendWelcomeEmail.js` and add the following code: 

    // --- File: sendWelcomeEmail.js ---
    function sendWelcomeEmail(username) {
      console.log(`[REAL EMAIL SERVICE]: Sending welcome email to ${username}`);
      // In a real application, this would involve API calls to an email service (e.g., SendGrid, Mailgun)
      // For now, it just logs, but we'll mock it in tests.
      return { success: true, message: `Email sent to ${username}` }; // Updated return value to be an object
    }

    // Export the functions so they can be imported and tested
    module.exports = {
      sendWelcomeEmail // Exported so it can be mocked
    };

### Step 2: Modify userManager.js

Add a new function sendWelcomeEmail and call it from registerUser. We'll make sendWelcomeEmail a separate export so we can mock or stub it.

// --- File: userManager.js (Updated) ---

    const { sendWelcomeEmail } = require("./sendWelcomeEmail");

    // A simple in-memory "database" to store user data
    // We're updating this to store more than just the password
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
      
      // Store the user with the password and an empty object for now
      _usersDb[username] = { password };

      // Get the result from our email service call
      const emailResult = sendWelcomeEmail(username);

      // --- NEW LOGIC FOR STUBBING EXAMPLE ---
      // If the email sending fails, we'll mark the user's account
      // In a real app, this might trigger a retry or a different flow.
      if (!emailResult.success) {
        _usersDb[username].emailFailed = true;
      }
      // --- END OF NEW LOGIC ---

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
      // Now we're checking against the password property
      return _usersDb[username].password === password;
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

    // A new function to check the internal user state, useful for testing the new logic
    function getUser(username) {
      return _usersDb[username];
    }

    // Export the functions so they can be imported and tested
    module.exports = {
      registerUser,
      loginUser,
      getUserCount,
      clearUsers,
      getUser, // Export the new helper function for our test
    };


### Step 3: Modify userManager.test.js to Mock and Stub sendWelcomeEmail

We will use jest.fn() to create a mock, and then mockReturnValue() to stub a specific return value.

    // --- File: userManager.test.js (Updated for Mocks & Stubs) ---
ß
    const { registerUser, loginUser, getUserCount, clearUsers, getUser } = require('./userManager');

    // Import the module containing the function we want to mock.
    jest.mock('./sendWelcomeEmail', () => ({
      sendWelcomeEmail: jest.fn(),
    }));

    const { sendWelcomeEmail } = require('./sendWelcomeEmail');

    beforeEach(() => {
      clearUsers();
      // Clear all mock calls and reset mock implementation before each test
      // This is crucial for mocking and stubbing, as it ensures each test starts fresh.
      sendWelcomeEmail.mockClear();
    });

    describe('registerUser function with email notification', () => {

      test('should successfully register a new user and send a welcome email', () => {
        // Arrange
        const username = "newuser";
        const password = "securepassword";
        
        // Stub the function to return a successful result
        sendWelcomeEmail.mockReturnValue({ success: true, message: "Email sent." });

        // Act
        const registrationSuccess = registerUser(username, password);

        // Assert
        expect(registrationSuccess).toBe(true);
        expect(getUserCount()).toBe(1);
        expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
        expect(sendWelcomeEmail).toHaveBeenCalledWith(username);
        
        // Assert that the emailFailed property was NOT added
        const user = getUser(username);
        expect(user.emailFailed).toBeUndefined();
      });

      test('should not send a welcome email if registration fails (user already exists)', () => {
        // Arrange
        registerUser("existinguser", "pass"); // Register once
        sendWelcomeEmail.mockClear(); // Clear initial call for this specific test
        
        // Act
        const registrationSuccess = registerUser("existinguser", "pass"); // Attempt to register again

        // Assert
        // expect(registrationSuccess).toBe(); // Registration should fail - expect to be?? 
        // expect(getUserCount()).toBe(); // User count should be ?? 
        // // Verify that sendWelcomeEmail was NOT called again
        // expect(sendWelcomeEmail).not.toHaveBeenCalled();
      });

      test('should not send email if username is empty', () => {
        // // Arrange & Act (expecting an error to be thrown)
        // expect(() => registerUser("", "pass")).toThrow("UPDATE THIS ERROR MESSAGE");

        // // Assert that the email function was not called
        // expect(sendWelcomeEmail); //COMPLETE THIS LINE
      });

      // --- NEW STUBBING TEST CASE ---
      test('should mark user account if email service returns an error', () => {
        // Arrange
        const username = "testuser";
        const password = "password123";
        
        // Use `mockReturnValue` to stub the function with a specific return value.
        // This is the core of the stubbing example. We are forcing the dependency
        // to behave in a specific way that we want to test.
        sendWelcomeEmail.mockReturnValue({ success: false, error: "Service unavailable." });

        // Act
        registerUser(username, password);

        // // Assert
        // // Verify the user was still created
        // // --- YOUR CODE HERE ---
        
        // // Verify the email function was called, even though it "failed"
        // // --- YOUR CODE HERE ---
        
        // // Now, we assert that our new logic in `registerUser`
        // // correctly reacted to the stubbed return value.
        // const user = getUser(username);
        // expect().toBe();
      });
    });

    // Continue with other tests for loginUser, etc., as before
    // ... (Your existing loginUser tests can go here)
