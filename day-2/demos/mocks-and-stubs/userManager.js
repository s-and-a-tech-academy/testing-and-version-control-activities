// --- File: userManager.js ---
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
    throw new Error("Username or password cannot be empty.");
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
