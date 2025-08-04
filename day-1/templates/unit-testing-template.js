// --- Project Setup Instructions ---
// 1. Create a new folder for your project (e.g., "unit-testing-practice").
// 2. Open your terminal or command prompt, navigate into that folder.
// 3. Run: `npm init -y` (This creates a package.json file).
// 4. Run: `npm install --save-dev jest` (This installs Jest as a development dependency).
// 5. Open the `package.json` file and add the following line under "scripts":
//    "test": "jest"
//    It should look something like this:
//    "scripts": {
//      "test": "jest"
//    },
// 6. Create a new file named `functions.js` in your project folder.
// 7. Copy the content below for `functions.js` into that file.
// 8. Create a new file named `functions.test.js` in your project folder.
// 9. Copy the content below for `functions.test.js` into that file.
// 10. To run the tests, open your terminal in the project folder and run: `npm test`

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

// --- File: functions.test.js ---
// This file is where apprentices will write their unit tests.
// It starts with a basic structure and an example test.

const { add, isEven, capitalise, reverseString } = require('./functions');

// --- Example Test (for demonstration) ---
describe('add function', () => {
  it('should correctly add two positive numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  // --- Apprentices will add more tests here ---
  // Example ideas for apprentices:
  // - Test with negative numbers
  // - Test with zero
  // - Test with floating-point numbers
  // - Test error handling for non-numeric inputs
});

describe('isEven function', () => {
  // Apprentices: Write tests for the isEven function here!
  // Example ideas:
  // - Test with an even number
  // - Test with an odd number
  // - Test with zero
  // - Test with negative even/odd numbers
  // - Test error handling for non-numeric inputs
});

describe('capitalise function', () => {
  // Apprentices: Write tests for the capitalise function here!
  // Example ideas:
  // - Test with a regular word
  // - Test with an empty string
  // - Test with a string that's already capitalised
  // - Test with a string that starts with a number or symbol (edge case)
});

describe('reverseString function', () => {
  // Apprentices: Write tests for the reverseString function here!
  // Example ideas:
  // - Test with a simple word
  // - Test with a sentence
  // - Test with an empty string
  // - Test with numbers/symbols in the string
});
