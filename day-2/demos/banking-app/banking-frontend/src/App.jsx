// App.jsx
import React, { useState, useEffect } from 'react';
import Ajv from 'ajv'; // Import Ajv

// Import the API schemas
import {
  registerSuccessResponseSchema,
  registerConflictResponseSchema,
  registerBadRequestResponseSchema,
  loginSuccessResponseSchema,
  loginUnauthorizedResponseSchema,
  balanceResponseSchema,
  transferSuccessResponseSchema,
  errorSchema // Generic error schema for 400s, 401s, 404s
} from './apiSchemas';

// Base URL for our backend API
const API_BASE_URL = 'http://localhost:3000';

// Initialize AJV validator once
const ajv = new Ajv();

// Compile schemas for reuse
const validateRegisterSuccess = ajv.compile(registerSuccessResponseSchema);
const validateRegisterConflict = ajv.compile(registerConflictResponseSchema);
const validateRegisterBadRequest = ajv.compile(registerBadRequestResponseSchema);
const validateLoginSuccess = ajv.compile(loginSuccessResponseSchema);
const validateLoginUnauthorized = ajv.compile(loginUnauthorizedResponseSchema);
const validateBalanceSuccess = ajv.compile(balanceResponseSchema);
const validateTransferSuccess = ajv.compile(transferSuccessResponseSchema);
const validateGenericError = ajv.compile(errorSchema); // For common error responses


// Main App component
function App() {
  // State to manage the current view (e.g., 'register', 'login', 'dashboard')
  const [currentPage, setCurrentPage] = useState('login');
  // State to store current user's data after successful login
  const [currentUser, setCurrentUser] = useState(null); // { username, password }
  // State for displaying messages (success or info)
  const [message, setMessage] = useState('');
  // State for displaying error messages
  const [error, setError] = useState('');
  // State for loading indicators during API calls
  const [isLoading, setIsLoading] = useState(false);

  // Function to clear messages and errors after a short delay
  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 5000); // Messages disappear after 5 seconds
  };

  // Callback function to handle successful login
  const handleLoginSuccess = (username, password) => {
    setCurrentUser({ username, password });
    setCurrentPage('dashboard');
    setMessage(`Welcome, ${username}!`);
    clearMessages();
  };

  // Callback function to handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setMessage('You have been logged out.');
    clearMessages();
  };

  // Render different components based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return (
          <RegisterForm
            setCurrentPage={setCurrentPage}
            setMessage={setMessage}
            setError={setError}
            setIsLoading={setIsLoading}
            clearMessages={clearMessages}
          />
        );
      case 'login':
        return (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
            setMessage={setMessage}
            setError={setError}
            setIsLoading={setIsLoading}
            clearMessages={clearMessages}
          />
        );
      case 'dashboard':
        // Only render dashboard if a user is logged in
        if (currentUser) {
          return (
            <Dashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              setMessage={setMessage}
              setError={setError}
              setIsLoading={setIsLoading}
              clearMessages={clearMessages}
            />
          );
        }
        // If somehow on dashboard page without currentUser, redirect to login
        setCurrentPage('login');
        return null;
      default:
        return (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
            setMessage={setMessage}
            setError={setError}
            setIsLoading={setIsLoading}
            clearMessages={clearMessages}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Simplified Banking App
        </h1>

        {/* Navigation buttons for main pages */}
        {!currentUser && ( // Only show navigation if not logged in
          <nav className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setCurrentPage('login')}
              className={`px-5 py-2 rounded-md font-medium transition-colors duration-200 ${
                currentPage === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className={`px-5 py-2 rounded-md font-medium transition-colors duration-200 ${
                currentPage === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Register
            </button>
          </nav>
        )}

        {/* Global Message Display */}
        {isLoading && (
          <div className="flex items-center justify-center mb-4 text-blue-500">
            <svg
              className="animate-spin h-5 w-5 mr-3"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-4">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Render the current page component */}
        {renderPage()}
      </div>
    </div>
  );
}

// Register Form Component
function RegisterForm({ setCurrentPage, setMessage, setError, setIsLoading, clearMessages }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // --- Frontend Contract Validation for /register endpoint ---
      let isValid = false;
      let validationErrors = null;

      if (response.ok) { // Status 2xx
        isValid = validateRegisterSuccess(data);
        validationErrors = validateRegisterSuccess.errors;
      } else if (response.status === 409) {
        isValid = validateRegisterConflict(data);
        validationErrors = validateRegisterConflict.errors;
      } else if (response.status === 400) {
        isValid = validateRegisterBadRequest(data);
        validationErrors = validateRegisterBadRequest.errors;
      } else { // Fallback for other unexpected errors
        isValid = validateGenericError(data);
        validationErrors = validateGenericError.errors;
      }

      if (!isValid) {
        console.error('API Response Schema Mismatch for /register:', validationErrors);
        setError('Server response format invalid. Please contact support. (Check console for details)');
        setIsLoading(false); // Ensure loading is off
        return; // Stop processing if contract is violated
      }
      // --- End Frontend Contract Validation ---

      if (response.ok) {
        setMessage(data.message || 'Registration successful!');
        setCurrentPage('login'); // Redirect to login after successful registration
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
      // Only clear messages if no error was explicitly set by validation
      if (!error) { // Check if 'error' state is empty
        clearMessages();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="reg-username"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="reg-password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Register
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setCurrentPage('login')}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Login here
        </button>
      </p>
    </form>
  );
}

// Login Form Component
function LoginForm({ onLoginSuccess, setCurrentPage, setMessage, setError, setIsLoading, clearMessages }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // --- Frontend Contract Validation for /login endpoint ---
      let isValid = false;
      let validationErrors = null;

      if (response.ok) { // Status 200
        isValid = validateLoginSuccess(data);
        validationErrors = validateLoginSuccess.errors;
      } else if (response.status === 401) {
        isValid = validateLoginUnauthorized(data);
        validationErrors = validateLoginUnauthorized.errors;
      } else if (response.status === 400) {
        isValid = validateGenericError(data); // Using generic error schema for 400
        validationErrors = validateGenericError.errors;
      } else { // Fallback for other unexpected errors
        isValid = validateGenericError(data);
        validationErrors = validateGenericError.errors;
      }

      if (!isValid) {
        console.error('API Response Schema Mismatch for /login:', validationErrors);
        setError('Server response format invalid. Please contact support. (Check console for details)');
        setIsLoading(false); // Ensure loading is off
        return; // Stop processing if contract is violated
      }
      // --- End Frontend Contract Validation ---

      if (response.ok) {
        setMessage(data.message || 'Login successful!');
        onLoginSuccess(username, password); // Pass credentials to parent App component
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
      // Only clear messages if no error was explicitly set by validation
      if (!error) { // Check if 'error' state is empty
        clearMessages();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="login-username"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Login
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setCurrentPage('register')}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Register here
        </button>
      </p>
    </form>
  );
}

// Dashboard Component (displays balance and includes TransferForm)
function Dashboard({ currentUser, onLogout, setMessage, setError, setIsLoading, clearMessages }) {
  const [balance, setBalance] = useState(null);

  // Function to fetch the user's balance
  const fetchBalance = async () => {
    if (!currentUser) return; // Don't fetch if no user

    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        username: currentUser.username,
        password: currentUser.password,
      });
      const response = await fetch(`${API_BASE_URL}/balance?${params.toString()}`, {
        method: 'GET',
      });

      const data = await response.json();

      // --- Frontend Contract Validation for /balance endpoint ---
      let isValid = false;
      let validationErrors = null;

      if (response.ok) { // Status 200
        isValid = validateBalanceSuccess(data);
        validationErrors = validateBalanceSuccess.errors;
      } else { // Fallback for other unexpected errors (400, 401, 404)
        isValid = validateGenericError(data);
        validationErrors = validateGenericError.errors;
      }

      if (!isValid) {
        console.error('API Response Schema Mismatch for /balance:', validationErrors);
        setError('Server response format invalid for balance. Please contact support. (Check console for details)');
        setIsLoading(false); // Ensure loading is off
        return; // Stop processing if contract is violated
      }
      // --- End Frontend Contract Validation ---

      if (response.ok) {
        setBalance(data.balance);
      } else {
        setError(data.message || 'Failed to fetch balance.');
      }
    } catch (err) {
      setError('Network error. Could not fetch balance.');
      console.error('Balance fetch error:', err);
    } finally {
      setIsLoading(false);
      // Only clear messages if no error was explicitly set by validation
      if (!error) { // Check if 'error' state is empty
        clearMessages();
      }
    }
  };

  // Fetch balance when component mounts or currentUser changes
  useEffect(() => {
    fetchBalance();
  }, [currentUser]); // Dependency array: re-run when currentUser changes

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Dashboard</h2>
        <p className="text-lg text-gray-700">Logged in as: <span className="font-semibold">{currentUser.username}</span></p>
        {balance !== null ? (
          <p className="text-4xl font-extrabold text-blue-600 mt-4">
            Balance: £{balance.toFixed(2)}
          </p>
        ) : (
          <p className="text-gray-500 mt-4">Loading balance...</p>
        )}
        <button
          onClick={fetchBalance}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Refresh Balance
        </button>
      </div>

      <TransferForm
        currentUser={currentUser}
        fetchBalance={fetchBalance} // Pass refresh function to TransferForm
        setMessage={setMessage}
        setError={setError}
        setIsLoading={setIsLoading}
        clearMessages={clearMessages}
      />

      <div className="border-t border-gray-200 pt-6 text-center">
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Transfer Funds Component
function TransferForm({ currentUser, fetchBalance, setMessage, setError, setIsLoading, clearMessages }) {
  const [receiverUsername, setReceiverUsername] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Basic client-side validation
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      setError('Transfer amount must be a positive number.');
      setIsLoading(false);
      clearMessages();
      return;
    }
    if (receiverUsername === currentUser.username) {
      setError('Cannot transfer to yourself.');
      setIsLoading(false);
      clearMessages();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUsername: currentUser.username,
          senderPassword: currentUser.password,
          receiverUsername,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      // --- Frontend Contract Validation for /transfer endpoint ---
      let isValid = false;
      let validationErrors = null;

      if (response.ok) { // Status 200
        isValid = validateTransferSuccess(data);
        validationErrors = validateTransferSuccess.errors;
      } else { // Fallback for other unexpected errors (400, 401, 404)
        isValid = validateGenericError(data);
        validationErrors = validateGenericError.errors;
      }

      if (!isValid) {
        console.error('API Response Schema Mismatch for /transfer:', validationErrors);
        setError('Server response format invalid for transfer. Please contact support. (Check console for details)');
        setIsLoading(false); // Ensure loading is off
        return; // Stop processing if contract is violated
      }
      // --- End Frontend Contract Validation ---

      if (response.ok) {
        setMessage(data.message || 'Funds transferred successfully!');
        setReceiverUsername(''); // Clear form fields
        setAmount('');
        fetchBalance(); // Refresh balance after successful transfer
      } else {
        setError(data.message || 'Transfer failed.');
      }
    } catch (err) {
      setError('Network error. Could not complete transfer.');
      console.error('Transfer error:', err);
    } finally {
      setIsLoading(false);
      // Only clear messages if no error was explicitly set by validation
      if (!error) { // Check if 'error' state is empty
        clearMessages();
      }
    }
  };

  return (
    <form onSubmit={handleTransfer} className="space-y-4 border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Transfer Funds</h3>
      <div>
        <label htmlFor="receiver-username" className="block text-sm font-medium text-gray-700">
          Receiver Username
        </label>
        <input
          type="text"
          id="receiver-username"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={receiverUsername}
          onChange={(e) => setReceiverUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (£)
        </label>
        <input
          type="number"
          id="amount"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Transfer
      </button>
    </form>
  );
}

export default App;