// --- File: functions.js ---
// This file contains simple functions for apprentices to test.

/**
 * Adds two numbers together.
 * @param {number} a - The first number.  
 * @param {number} b - The second number. 
 * @returns {number} The sum of a and b.
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers.');
  }
  return a + b;
}

/**
 * Checks if a given number is even.
 * @param {number} number - The number to check.
 * @returns {boolean} True if the number is even, false otherwise.
 */
function isEven(number) {
  if (typeof number !== 'number') {
    throw new Error('Input must be a number.');
  }
  return number % 2 === 0;
}

/**
 * Capitalises the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalised.
 */
function capitalise(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return ''; // Handle non-string or empty string input
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a given string.
 * @param {string} str - The input string.
 * @returns {string} The reversed string.
 */
function reverseString(str) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string.');
  }
  return str.split('').reverse().join('');
}

// Export the functions so they can be imported and tested
module.exports = {
  add,
  isEven,
  capitalise,
  reverseString
};