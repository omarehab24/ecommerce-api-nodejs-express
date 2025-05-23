require("dotenv").config()

/**
 * Configuration utility for managing environment-specific settings
 * 
 * Loads environment variables for different deployment environments
 * and provides a centralized configuration management.
 * 
 * @module config
 * @requires dotenv
 * 
 * @property {number} PORT - Server port number
 * @property {string} MONGODB_URI - MongoDB connection URI (different for test/production)
 * @property {string} JWT_SECRET - Secret key for JWT token generation
 * @property {string} GMAIL_EMAIL - Email address for sending verification emails
 * @property {string} GMAIL_PASS - Password/App password for email service
 * @property {string} ORIGIN - Allowed origin for CORS and security settings
 */

// Server port configuration
const PORT = process.env.PORT

// Dynamic MongoDB URI based on environment
const MONGODB_URI = process.env.NODE_ENV === "test"
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

// JWT Secret for authentication
const JWT_SECRET = process.env.JWT_SECRET

// Gmail credentials for email service
const GMAIL_EMAIL = process.env.GMAIL_EMAIL
const GMAIL_PASS = process.env.GMAIL_PASS

// Origin configuration for security
const ORIGIN = process.env.ORIGIN

// AWS S3 configuration
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_REGION = process.env.AWS_REGION

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  GMAIL_PASS,
  GMAIL_EMAIL,
  ORIGIN,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION
}