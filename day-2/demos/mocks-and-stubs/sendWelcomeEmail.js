function sendWelcomeEmail(username) {
  console.log(`[REAL EMAIL SERVICE]: Sending welcome email to ${username}`);
  // In a real application, this would involve API calls to an email service (e.g., SendGrid, Mailgun)
  // For now, it just logs, but we'll mock it in tests.
  return `Email sent to ${username}`; // Return value for potential stubbing
}

// Export the functions so they can be imported and tested
module.exports = {
  sendWelcomeEmail // Exported so it can be mocked
};