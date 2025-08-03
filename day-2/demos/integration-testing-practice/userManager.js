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