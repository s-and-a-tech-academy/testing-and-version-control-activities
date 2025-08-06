// --- File: userManager.component.test.js ---
// This file demonstrates a component-level test suite for the userManager module.
// It treats the entire userManager.js file as a single, testable component.

// We import the functions we need to test.
const { registerUser, loginUser, getUserCount, clearUsers } = require('./userManager');

// We use Jest to mock external dependencies. In this case, it's the email service.
// This is crucial for a component test, as we don't want to actually send emails.
jest.mock('./sendWelcomeEmail', () => ({
  sendWelcomeEmail: jest.fn(),
}));
const { sendWelcomeEmail } = require('./sendWelcomeEmail');

// The `beforeEach` hook is used to reset the component's internal state
// and our mock function before every test, ensuring isolation between tests.
beforeEach(() => {
  clearUsers();
  sendWelcomeEmail.mockClear();
});


// --- Component Tests for the entire userManager module ---
// This `describe` block treats the `userManager` module as a single unit (component).
// It tests the public API and the interactions between its internal functions.
describe('userManager component', () => {

  test('should successfully register and then log in a user', () => {
    // We test a full, valid user flow from registration to login.
    // This checks that registerUser and loginUser work together as expected.
    // Arrange
    const username = "newComponentUser";
    const password = "newComponentPassword";

    // Act
    const registrationSuccess = registerUser(username, password);
    const loginSuccess = loginUser(username, password);

    // Assert
    expect(registrationSuccess).toBe(true);
    expect(loginSuccess).toBe(true);
    expect(getUserCount()).toBe(1);
    expect(sendWelcomeEmail).toHaveBeenCalledWith(username);
  });

  test('should not allow login with incorrect credentials after registration', () => {
    // We test another full flow, but with an expected failure at the login step.
    // This confirms that the component's internal logic correctly handles invalid credentials.
    // Arrange
    const username = "badLoginComponent";
    const password = "correctPassword";
    registerUser(username, password);

    // Act
    const loginResult = loginUser(username, "wrongPassword");

    // Assert
    expect(loginResult).toBe(false);
    expect(getUserCount()).toBe(1);
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });

  test('should correctly handle a registration failure and not add a duplicate user', () => {
    // This test ensures that the component's state is not corrupted by a failed operation.
    // Arrange
    const username = "duplicateComponentUser";
    const password = "password123";
    registerUser(username, password); // Initial registration

    // Act: Attempt a second registration with the same username
    const secondRegistrationSuccess = registerUser(username, password);

    // Assert
    expect(secondRegistrationSuccess).toBe(false);
    expect(getUserCount()).toBe(1); // The user count should not have increased
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1); // The email should not be sent a second time
  });

});
