import { useState } from 'react';
import GreetingForm from './GreetingForm'; // Import your component

// Main App component
function App() {
  // State to hold the greeting message
  const [greetingMessage, setGreetingMessage] = useState('');

  // Function to set the greeting message when the form is submitted
  const handleGreet = (name) => {
    setGreetingMessage(`Hello, ${name}! Welcome to the app!`);
  };

  // Function to clear the greeting message state
  const handleClearMessage = () => {
    setGreetingMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Awesome App</h1>

      <GreetingForm onGreet={handleGreet} />

      {/* Conditionally render the message container */}
      {greetingMessage && (
        <div className="mt-8 text-xl font-semibold text-green-700 bg-green-100 p-4 rounded-lg shadow-sm flex justify-between items-center w-full max-w-md">
          {/* The greeting message text */}
          <span>
            {greetingMessage}
          </span>
          
          {/* Button to clear the message */}
          {/* The `onClick` handler calls the `handleClearMessage` function */}
          <button
            onClick={handleClearMessage}
            className="ml-4 text-green-700 hover:text-green-900 font-bold text-2xl transition-transform transform hover:scale-110 focus:outline-none"
            aria-label="Clear message"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
