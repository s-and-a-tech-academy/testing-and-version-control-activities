// --- File: userManager.test.js ---
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

  it('should successfully register a new user and send a welcome email', () => {
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

  it('should not send a welcome email if registration fails (user already exists)', () => {
    // Arrange
    registerUser("existinguser", "pass"); // Register once
    sendWelcomeEmail.mockClear(); // Clear initial call for this specific it
    
    // Act
    const registrationSuccess = registerUser("existinguser", "pass"); // Attempt to register again

    // Assert
    // expect(registrationSuccess).toBe(); // Registration should fail - expect to be?? 
    // expect(getUserCount()).toBe(); // User count should be ?? 
    // // Verify that sendWelcomeEmail was NOT called again
    // expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should not send email if username is empty', () => {
    // // Arrange & Act (expecting an error to be thrown)
    // expect(() => registerUser("", "pass")).toThrow("UPDATE THIS ERROR MESSAGE");

    // // Assert that the email function was not called
    // expect(sendWelcomeEmail); //COMPLETE THIS LINE
  });

  // --- NEW STUBBING TEST CASE ---
  it('should mark user account if email service returns an error', () => {
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
