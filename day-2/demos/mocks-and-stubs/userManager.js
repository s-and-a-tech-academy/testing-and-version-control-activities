// --- File: userManager.js (Updated) ---
const { sendWelcomeEmail } = require("./sendWelcomeEmail");

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