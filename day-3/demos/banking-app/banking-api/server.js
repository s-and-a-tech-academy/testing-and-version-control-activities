const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Use promise-based fs for async operations
const path = require('path');
const Ajv = require('ajv'); // Import Ajv

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json'); // Path to our JSON database file

// --- In-Memory Data (will be loaded from/saved to db.json) ---
let users = {};    // Stores { username: password }
let accounts = {}; // Stores { username: { balance: number } }

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS for all origins during development
// In production, you would restrict this to specific origins
app.use(cors({
  origin: 'http://localhost:5173' // Only allow your frontend origin
}));

// --- AJV Setup and Schemas (Copied from apiSchemas.js for simplicity in one file) ---
const ajv = new Ajv();

const registerRequestSchema = {
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" }
  },
  "required": ["username", "password"],
  "additionalProperties": false
};

const loginRequestSchema = {
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" }
  },
  "required": ["username", "password"],
  "additionalProperties": false
};

const transferRequestSchema = {
  "type": "object",
  "properties": {
    "senderUsername": { "type": "string" },
    "senderPassword": { "type": "string" },
    "receiverUsername": { "type": "string" },
    "amount": { "type": "number" }
  },
  "required": ["senderUsername", "senderPassword", "receiverUsername", "amount"],
  "additionalProperties": false
};

const registerSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

const loginSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

const balanceResponseSchema = {
  "type": "object",
  "properties": {
    "balance": { "type": "number" }
  },
  "required": ["balance"],
  "additionalProperties": false
};

const transferSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

const errorResponseSchema = { // Generic schema for common error messages
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

// Compile schemas for validation
const validateRegisterRequest = ajv.compile(registerRequestSchema);
const validateLoginRequest = ajv.compile(loginRequestSchema);
const validateTransferRequest = ajv.compile(transferRequestSchema);

const validateRegisterSuccessResponse = ajv.compile(registerSuccessResponseSchema);
const validateLoginSuccessResponse = ajv.compile(loginSuccessResponseSchema);
const validateBalanceResponse = ajv.compile(balanceResponseSchema);
const validateTransferSuccessResponse = ajv.compile(transferSuccessResponseSchema);
const validateErrorResponse = ajv.compile(errorResponseSchema);

// --- Middleware for Request Body Validation ---
function validateRequestBody(schema) {
  return (req, res, next) => {
    const validate = ajv.compile(schema); // Compile schema for this specific request
    const valid = validate(req.body);
    if (!valid) {
      console.error('Request Body Validation Errors:', validate.errors);
      return res.status(400).json({ message: 'Invalid request body format.', errors: validate.errors });
    }
    next();
  };
}

// --- Helper for Response Body Validation (Internal Check) ---
// This function will be called *before* sending the response to ensure it matches the schema.
// If it doesn't, it indicates a bug in the backend's response generation.
function validateAndSendResponse(res, statusCode, data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(`Internal Server Error: Response for status ${statusCode} failed schema validation:`, validate.errors);
    // In a real production app, you might log this error and send a generic 500.
    // For this exercise, we'll send the valid/invalid response to show the error.
    return res.status(500).json({ message: 'Internal server error: Response contract violated.', details: validate.errors });
  }
  res.status(statusCode).json(data);
}

// --- Database Utility Functions ---

/**
 * Reads data from the db.json file.
 * @returns {Promise<Object>} An object containing users and accounts data.
 */
async function readDb() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const db = JSON.parse(data);
        users = db.users || {};
        accounts = db.accounts || {};
        console.log('Database loaded from db.json');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('db.json not found, initializing with empty data.');
            users = {};
            accounts = {};
            await writeDb(); // Create the file with empty data
        } else {
            console.error('Error reading database:', error);
            // In a real app, you might want to exit or handle this more gracefully
        }
    }
}

/**
 * Writes current users and accounts data to the db.json file.
 * @returns {Promise<void>}
 */
async function writeDb() {
    const db = { users, accounts };
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
        console.log('Database saved to db.json');
    } catch (error) {
        console.error('Error writing database:', error);
    }
}

// --- Helper Function for Authentication ---
function authenticateUser(username, password) {
    return users[username] && users[username] === password;
}

// --- API Endpoints ---

/**
 * @api {post} /register Register User
 * @apiName RegisterUser
 * @apiGroup User
 * @apiParam {String} username User's unique username.
 * @apiParam {String} password User's password.
 * @apiSuccess {String} message User registered successfully.
 * @apiError (400 Bad Request) {String} message Username or password missing.
 * @apiError (409 Conflict) {String} message Username already exists.
 */
app.post('/register', async (req, res) => { // Made async to await writeDb
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (users[username]) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    users[username] = password;
    accounts[username] = { balance: 1000 }; // Give new users a starting balance
    await writeDb(); // Save changes to file

    console.log(`User registered: ${username}, Initial balance: ${accounts[username].balance}`);
    return res.status(201).json({ message: 'User registered successfully.' });
});

/**
 * @api {post} /login Login User
 * @apiName LoginUser
 * @apiGroup User
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiSuccess {String} message Login successful.
 * @apiError (401 Unauthorized) {String} message Invalid credentials.
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (authenticateUser(username, password)) {
        // In a real app, you'd issue a JWT token here
        return res.status(200).json({ message: 'Login successful.' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
});

/**
 * @api {get} /balance Get Account Balance
 * @apiName GetBalance
 * @apiGroup Account
 * @apiParam {String} username User's username (for authentication).
 * @apiParam {String} password User's password (for authentication).
 * @apiSuccess {Number} balance User's account balance.
 * @apiError (401 Unauthorized) {String} message Authentication failed.
 * @apiError (404 Not Found) {String} message User account not found.
 */
app.get('/balance', (req, res) => {
    const { username, password } = req.query; // Using query params for GET for simplicity

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (!authenticateUser(username, password)) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }

    if (!accounts[username]) {
        return res.status(404).json({ message: 'User account not found.' });
    }

    return res.status(200).json({ balance: accounts[username].balance });
});

/**
 * @api {post} /transfer Transfer Funds
 * @apiName TransferFunds
 * @apiGroup Account
 * @apiParam {String} senderUsername Sender's username.
 * @apiParam {String} senderPassword Sender's password.
 * @apiParam {String} receiverUsername Receiver's username.
 * @apiParam {Number} amount Amount to transfer.
 * @apiSuccess {String} message Transfer successful.
 * @apiError (400 Bad Request) {String} message Invalid transfer details.
 * @apiError (401 Unauthorized) {String} message Authentication failed.
 * @apiError (404 Not Found) {String} message Sender or receiver account not found.
 * @apiError (400 Bad Request) {String} message Insufficient funds.
 * @apiError (400 Bad Request) {String} message Cannot transfer to self.
 */
app.post('/transfer', async (req, res) => { // Made async to await writeDb
    const { senderUsername, senderPassword, receiverUsername, amount } = req.body;

    if (!senderUsername || !senderPassword || !receiverUsername || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer details. Check all fields and amount.' });
    }

    if (!authenticateUser(senderUsername, senderPassword)) {
        return res.status(401).json({ message: 'Authentication failed for sender.' });
    }

    if (senderUsername === receiverUsername) {
        return res.status(400).json({ message: 'Cannot transfer to yourself.' });
    }

    if (!accounts[senderUsername]) {
        return res.status(404).json({ message: 'Sender account not found.' });
    }

    if (!accounts[receiverUsername]) {
        return res.status(404).json({ message: 'Receiver account not found.' });
    }

    if (accounts[senderUsername].balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds.' });
    }

    // Perform the transfer
    accounts[senderUsername].balance -= amount;
    accounts[receiverUsername].balance += amount;
    await writeDb(); // Save changes to file

    console.log(`Transfer: ${senderUsername} sent ${amount} to ${receiverUsername}`);
    console.log(`${senderUsername} balance: ${accounts[senderUsername].balance}`);
    console.log(`${receiverUsername} balance: ${accounts[receiverUsername].balance}`);

    return res.status(200).json({ message: 'Transfer successful.' });
});

// --- Server Initialization ---
// Load database and then start the server
async function startServer() {
    await readDb();
    app.listen(PORT, () => {
        console.log(`Banking API server running on http://localhost:${PORT}`);
        console.log('Available Endpoints: /register, /login, /balance, /transfer');
    });
}

startServer();

// --- For testing purposes, export the app and internal data (optional, but useful for integration tests) ---
// Note: When using a file-based DB, direct manipulation of `users` and `accounts`
// from tests might not reflect the file state unless readDb/writeDb are called.
// For robust testing, consider a dedicated test setup that clears/loads the file.
module.exports = { app, users, accounts, readDb, writeDb };