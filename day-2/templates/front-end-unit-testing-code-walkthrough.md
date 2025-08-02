 # React Frontend Unit Testing Exercise with React Testing Library (Independent)
This exercise will guide you through writing basic unit tests for a simple React component using the React Testing Library. We will create a GreetingForm component from scratch and then write tests to verify its rendering and basic user interactions.

## Why React Testing Library?
React Testing Library is a set of utilities that helps you test React components in a way that resembles how users interact with your application. Its guiding principle is: "The more your tests resemble the way your software is used, the more confidence they can give you."

## Materials Required:
- Node.js and npm installed.
- A code editor (VS Code recommended).

## Setup: 
### Create Your React Project & Install Testing Dependencies
Create a new React Project:
Open your terminal/command prompt and run the following commands:

### Create a new Vite React project in a folder named 'greeting-form'
`npm init vite@latest greeting-form -- --template react`

### Navigate into your new project folder
`cd greeting-form`

### Install project dependencies
npm install

Add Tailwind CSS (Optional, but recommended for styling):
Open index.html in the root of your greeting-form folder and add the Tailwind CDN script inside the <head> tag:

    <head>
      <!-- ... other head content ... -->
      <script src="https://cdn.tailwindcss.com"></script>
    </head>

### Install Testing Dependencies:
In your `greeting-form` terminal, run:

    npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

### Install Babel for Jest (Crucial for React/JSX/ESM support):
You need Babel to transform your React code (JSX and ES Modules) so Jest can understand it.
In your `greeting-form` terminal, run:

    npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react

### Configure Babel:
Create a file named `babel.config.cjs` (note the .cjs extension!) in the root of your `greeting-form` project folder with the following content:

    // babel.config.cjs
    module.exports = {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    };

### Configure Jest:
Create a file named jest.config.cjs (note the .cjs extension!) in the root of your `greeting-form` project folder with the following content:

    // jest.config.cjs
    module.exports = {
      testEnvironment: 'jest-environment-jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      // Add transform to tell Jest to use babel-jest for .js, .jsx files
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      // Jest might ignore node_modules by default, but sometimes you need to
      // explicitly tell it to transform specific modules if they use ESM.
      // For this exercise, the default should be fine, but keep this in mind:
      // transformIgnorePatterns: ['/node_modules/(?!your-esm-module-here)/'],
    };

And create a file named `setupTests.js` inside the `src` folder (greeting-form/src/setupTests.js) with:

    // src/setupTests.js
    import '@testing-library/jest-dom';

    Update package.json scripts:
    Open your package.json file in the root of greeting-form and add/update the test script:

    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "test": "jest" // Add or ensure this line exists
    },

## Component to Test: GreetingForm
We will create a simple GreetingForm component. Its responsibilities include:

- Rendering an input field for a name.

- Rendering a button to submit the name.

- Calling a function passed as a prop when the button is clicked.

### Step 1: Create the GreetingForm Component File
In your src directory (greeting-form/src/), create a new file named GreetingForm.jsx.

**In src/GreetingForm.jsx:**
// src/GreetingForm.jsx
    import React, { useState } from 'react';

    /**
    * A simple form component to get a user's name and greet them.
    * @param {object} props - Component props.
    * @param {function} props.onGreet - Callback function called with the name when the form is submitted.
    */
    function GreetingForm({ onGreet }) {
      const [name, setName] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) { // Only greet if name is not empty
          onGreet(name);
          setName(''); // Clear input after greeting
        }
      };

      return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Say Hello!</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-gray-700">
                Enter your name:
              </label>
              <input
                type="text"
                id="name-input"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Greet Me!
            </button>
          </form>
        </div>
      );
    }

export default GreetingForm;

### Step 2: Update App.jsx to Use GreetingForm
To see your component in action, replace the content of your greeting-form/src/App.jsx file with the following:

**In src/App.jsx:**

    // src/App.jsx
    import React, { useState } from 'react';
    import GreetingForm from './GreetingForm'; // Import your new component

    function App() {
      const [greetingMessage, setGreetingMessage] = useState('');

      const handleGreet = (name) => {
        setGreetingMessage(`Hello, ${name}! Welcome to the app!`);
      };

      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Awesome App</h1>

          <GreetingForm onGreet={handleGreet} />

          {greetingMessage && (
            <p className="mt-8 text-xl font-semibold text-green-700 bg-green-100 p-4 rounded-lg shadow-sm">
              {greetingMessage}
            </p>
          )}
        </div>
      );
    }

    export default App;

You can run `npm run dev` in your terminal to see this simple app in your browser.

## Writing Tests for GreetingForm
### Step 3: Create the Test File
In your src directory (greeting-form/src/), create a new file named GreetingForm.test.jsx.

### Step 4: Basic Rendering and Interaction Tests
Let's verify that the GreetingForm component renders correctly, allows input, and calls its onGreet prop when submitted.

**In src/GreetingForm.test.jsx:**
      // src/GreetingForm.test.jsx
      import React from 'react';
      import { render, screen, fireEvent } => from '@testing-library/react';
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

        test('renders the name input and a "Greet Me!" button', () => {
          render(<GreetingForm onGreet={mockOnGreet} />);

          // Use screen.getByLabelText to find the input by its associated label
          expect(screen.getByLabelText(/enter your name/i)).toBeInTheDocument();

          // Use screen.getByRole to find the button by its semantic role and accessible name
          expect(screen.getByRole('button', { name: /greet me!/i })).toBeInTheDocument();
        });

        test('allows typing into the name input field', () => {
            render(<GreetingForm onGreet={mockOnGreet} />);

            const nameInput = screen.getByLabelText(/enter your name/i);

            // Simulate user typing into the input
            fireEvent.change(nameInput, { target: { value: 'Alice' } });

            // Assert that the input value has updated
            expect(nameInput).toHaveValue('Alice');
        });

        test('calls the onGreet prop with the entered name when the form is submitted', () => {
            render(<GreetingForm onGreet={mockOnGreet} />);

            const nameInput = screen.getByLabelText(/enter your name/i);
            const greetButton = screen.getByRole('button', { name: /greet me!/i });

            // Simulate typing a name
            fireEvent.change(nameInput, { target: { value: 'Bob' } });

            // Simulate clicking the submit button
            fireEvent.click(greetButton);

            // Assert that onGreet was called exactly once
            expect(mockOnGreet).toHaveBeenCalledTimes(1);
            // Assert that onGreet was called with the correct name
            expect(mockOnGreet).toHaveBeenCalledWith('Bob');
        });

        test('clears the input field after submission', () => {
            render(<GreetingForm onGreet={mockOnGreet} />);

            const nameInput = screen.getByLabelText(/enter your name/i);
            const greetButton = screen.getByRole('button', { name: /greet me!/i });

            fireEvent.change(nameInput, { target: { value: 'Charlie' } });
            fireEvent.click(greetButton);

            // Assert that the input field is empty after submission
            expect(nameInput).toHaveValue('');
        });

        test('does NOT call onGreet if the input field is empty on submission', () => {
            render(<GreetingForm onGreet={mockOnGreet} />);

            const greetButton = screen.getByRole('button', { name: /greet me!/i });

            // Simulate clicking the submit button with an empty input
            fireEvent.click(greetButton);

            // Assert that onGreet was NOT called
            expect(mockOnGreet).not.toHaveBeenCalled();
        });
      });

## Run the tests:
In your greeting-form terminal, `run npm test`. You should see all tests pass!

## Explanation of Key Concepts Used:
**render(component):** Renders your React component into a virtual DOM (provided by jsdom), making it available for testing.

**screen.getBy... queries:** These are the primary ways to find elements in the rendered component. They prioritize queries that users would use (e.g., getByLabelText, getByRole, getByText). This promotes accessibility and makes your tests more resilient to UI changes.

**getByLabelText(/enter your name/i):** Finds an input by its associated label. The /enter your name/i is a regular expression for case-insensitive matching.

**getByRole('button', { name: /greet me!/i }):** Finds a button by its semantic role and accessible name.

**@testing-library/jest-dom:** Provides custom Jest matchers (like toBeInTheDocument, toHaveValue, toHaveBeenCalledTimes, toHaveBeenCalledWith) that make assertions on DOM elements and mock functions more readable and expressive.

**fireEvent.change(element, { target: { value: '...' } }):** Simulates a user typing into an input field.

**fireEvent.click(element):** Simulates a user clicking an element.

**jest.fn():** Creates a mock function for onGreet. This allows you to:

- Check if it was called (toHaveBeenCalledTimes).

- Check what arguments it was called with (toHaveBeenCalledWith).

- Ensure your component correctly triggers the prop function when expected.
