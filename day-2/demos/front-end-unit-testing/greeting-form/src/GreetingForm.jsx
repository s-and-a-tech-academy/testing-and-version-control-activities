import { useState } from 'react';

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
            onChange={(event) => setName(event.target.value)}
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