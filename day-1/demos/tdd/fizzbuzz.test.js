// ##  Kata 1: FizzBuzz
// 1. For numbers divisible by 3, return "Fizz".
// 2. For numbers divisible by 5, return "Buzz".
// 3. For numbers divisible by both 3 and 5, return "FizzBuzz".
// 4. For other numbers, return the number itself (as a string).

const {fizzBuzz} = require('./fizzbuzz');
describe('fizzBuzz', () => {
    it('should return "1" if input is 1', () => {
        //arrange
        const input = 1;

        //act
        const result = fizzBuzz(input);

        // assert
        expect(result).toBe("1");
    })

    it('should return "2" if input is 2', () => {
        expect(fizzBuzz(2)).toBe("2");
    })

    it('should return "Fizz" if the input is divisible by 3', () => {
        // arrange 
        const input = 3;

        // act
        const result = fizzBuzz(input);

        // assert
        expect(result).toBe('Fizz');
    })

	it('should return "Buzz" if the input is divisable by 5' , () => {
		//arrange
		const input = 5;
		// act
        const result = fizzBuzz(input);
        // assert
        expect(result).toBe('Buzz');
    })
    
})

