// src/GreetingForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like toBeInTheDocument
import GreetingForm from './GreetingForm'; // Import the component you want to test

describe('GreetingForm', () => {
    // Mock the onGreet prop function.
    // We use jest.fn() so we can check if this function was called and with what arguments.
    const mockOnGreet = jest.fn();

    // Reset mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks(); // Clears any calls made to mockOnGreet in previous tests
    });

    it('renders the "name" input field and a "Greet Me!" button', () => {
        //arrange
        render(<GreetingForm onGreet={mockOnGreet} />);
        // Use screen.getByLabelText to find the input by its associated label
        const inputField = screen.getByLabelText(/enter your name/i);
        // Use screen.getByRole to find the button by its semantic role and accessible name
        const greetMeButton = screen.getByRole('button', { name: /greet me!/i });

        // act

        // assert
        expect(inputField).toBeInTheDocument();
        expect(greetMeButton).toBeInTheDocument();
    });

    it('allows typing into the name input field', () => {
        //arrange
        render(<GreetingForm onGreet={mockOnGreet} />);
        const nameInput = screen.getByLabelText(/enter your name/i);

        //act
        // Simulate user typing into the input
        fireEvent.change(nameInput, { target: { value: 'Alice' } });

        // Assert that the input value has updated
        expect(nameInput).toHaveValue('Alice');
    });

    // it('calls the onGreet prop with the entered name when the form is submitted', () => {
    //     //arrange
    //     render(<GreetingForm onGreet={mockOnGreet} />);

    //     const nameInput = screen.getByLabelText(/enter your name/i);
    //     const greetButton = screen.getByRole('button', { name: /greet me!/i });

    //     //act
    //     // Simulate typing a name
        

    //     // Simulate clicking the submit button
        

    //     // Assert that onGreet was called exactly once
    //     expect(mockOnGreet).toHaveBeenCalledTimes(1);
    //     // Assert that onGreet was called with the correct name
    //     expect(mockOnGreet).toHaveBeenCalledWith('Bob');
    // });

    // it('clears the input field after submission', () => {
    //     //arrange
    //     render(<GreetingForm onGreet={mockOnGreet} />);
    //     const nameInput = screen.getByLabelText(/enter your name/i);
    //     const greetButton = screen.getByRole('button', { name: /greet me!/i });

    //     //act
    //     fireEvent.change(nameInput, { target: { value: 'Charlie' } });
    //     fireEvent.click(greetButton);

    //     // Assert that the input field is empty after submission
        
    // });

    // it('does NOT call onGreet if the input field is empty on submission', () => {
    //     render(<GreetingForm onGreet={mockOnGreet} />);
    //     const greetButton = screen.getByRole('button', { name: /greet me!/i });

    //     // Simulate clicking the submit button with an empty input

    //     // Assert that onGreet was NOT called
    // });
});