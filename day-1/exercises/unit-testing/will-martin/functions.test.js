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

	it("should be true for an even number", () => {
		const num = 4;
		const result = isEven(num);

		expect(result).toBe(true);
	});

	it("should be false for an odd number", () => {
		const num = 5;
		const result = isEven(num);

		expect(result).toBe(false);
	});

	it("should be true for zero", () => {
		const num = 0;
		const result = isEven(num);

		expect(result).toBe(true);
	});

	it("should be true for negative even", () => {
		const num = -2;
		const result = isEven(num);

		expect(result).toBe(true);
	});

	it("should be false for negative odd", () => {
		const num = -1;
		const result = isEven(num);

		expect(result).toBe(false);
	});

	it("should throw on a string passed", () => {
		const str = "aaa";

		/*try {
			const result = isEven(str);
		} catch (err) {
			expect(err.message).toBe('Input must be a number.');
		}*/

		expect(() => isEven(str)).toThrow('Input must be a number.');
	})

    
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
