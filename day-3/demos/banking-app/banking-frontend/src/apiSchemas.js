// src/apiSchemas.js
// This file contains the JSON Schemas extracted from your OpenAPI Specification.
// These will be used by both frontend and backend for contract validation.

// --- /register endpoint schemas ---
export const registerRequestSchema = {
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" }
  },
  "required": ["username", "password"],
  "additionalProperties": false
}; 

export const registerSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

export const registerConflictResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

export const registerBadRequestResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

// --- /login endpoint schemas ---
export const loginRequestSchema = {
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" }
  },
  "required": ["username", "password"],
  "additionalProperties": false
};

export const loginSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

export const loginUnauthorizedResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

// --- /balance endpoint schemas ---
export const balanceResponseSchema = {
  "type": "object",
  "properties": {
    "balance": { "type": "number" }
  },
  "required": ["balance"],
  "additionalProperties": false
};

// --- /transfer endpoint schemas ---
export const transferRequestSchema = {
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

export const transferSuccessResponseSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};

// Generic error schema for common 4xx responses (e.g., 400, 401, 404, 409)
export const errorSchema = {
  "type": "object",
  "properties": {
    "message": { "type": "string" }
  },
  "required": ["message"],
  "additionalProperties": false
};