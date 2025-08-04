// --- File: userManager.component.test.js ---
const {
  registerUser,
  loginUser,
  getUserCount,
  getUser,
  clearUsers,
} = require('./userManager');

// Mock the external dependency, sendWelcomeEmail.
jest.mock('./sendWelcomeEmail', () => ({
  sendWelcomeEmail: jest.fn(() => ({ success: true })), 
}));

const { sendWelcomeEmail } = require('./sendWelcomeEmail');

beforeEach(() => {
  clearUsers();
  sendWelcomeEmail.mockClear();
});


describe('userManager Component Tests', () => {

  // --- Test Case 1: Successful User Registration ---
  it('should successfully register a new user and call the email service', () => {
    // Arrange
    const username = "componentUser";
    const password = "password123";

    // Act
    const registrationSuccess = registerUser(username, password);

    // Assert
    expect(registrationSuccess).toBe(true);
    expect(getUserCount()).toBe(1);

    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendWelcomeEmail).toHaveBeenCalledWith(username);
  });


  // --- Test Case 2: Registration Failure (user already exists) ---
  it('should fail to register an existing user and NOT call the email service', () => {
    // Arrange
    registerUser("duplicateUser", "pass");
    sendWelcomeEmail.mockClear();

    // Act
    const registrationSuccess = registerUser("duplicateUser", "pass");

    // Assert
    expect(registrationSuccess).toBe(false);
    expect(getUserCount()).toBe(1);

    expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });


  // --- Test Case 3: Stubbing the Dependency to Test Error Logic ---
  test('should correctly mark a user account if the email service stub returns a failure', () => {
    // Arrange
    const username = "stubbedUser";
    const password = "testPassword";
    
    // This is the stubbing part: we are programming our mock to return a specific value.
    sendWelcomeEmail.mockReturnValue({ success: false, error: "Stubbed failure." });

    // Act
    registerUser(username, password);

    // Assert
    // We confirm the user was created, despite the email "failure"
    const user = getUser(username);
    expect(user).toBeDefined();

    // Now, we test the core logic of our component: did it correctly react to the stub?
    expect(user.emailFailed).toBe(true);
  });

  // --- Test Case 4: Login Success ---
  it('should successfully log in a registered user', () => {
    // Arrange
    registerUser("loginTestUser", "loginPass");

    // Act
    const loginSuccess = loginUser("loginTestUser", "loginPass");

    // Assert
    expect(loginSuccess).toBe(true);
  });

  // --- Test Case 5: Login Failure (incorrect password) ---
  it('should fail to log in with an incorrect password', () => {
    // Arrange
    registerUser("loginTestUser", "loginPass");

    // Act
    const loginSuccess = loginUser("loginTestUser", "wrongPass");

    // Assert
    expect(loginSuccess).toBe(false);
  });

});
