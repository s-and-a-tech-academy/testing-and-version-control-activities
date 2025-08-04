// --- File: functions.test.js ---
// This file is where apprentices will write their unit tests.
// It starts with a basic structure and an example test.

const { add, isEven, capitalise, reverseString } = require('./functions');

// --- Example Test (for demonstration) ---
describe('add function', () => {
  it('should correctly add two positive numbers', () => {
    // arrange
    const num1 = 1;
	const num2 = 3;

    // act
    const result = add(num1, num2);

    //assert
    expect(result).toBe(4);
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