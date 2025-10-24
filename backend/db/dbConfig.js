// Database configuration for PostgreSQL
// Supports both individual connection parameters and DATABASE_URL

require('dotenv').config();
const { Pool } = require('pg');

// Create connection configuration
const dbConfig = {
  // Individual connection parameters (for Railway style)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Connection pool settings for better performance
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
};

// For production/hosted databases with SSL
if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (Heroku, Railway, etc.)
  dbConfig.connectionString = process.env.DATABASE_URL;
  // SSL configuration for hosted databases
  if (process.env.NODE_ENV === 'production') {
    dbConfig.ssl = {
      rejectUnauthorized: false
    };
  }
}

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('📊 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

module.exports = { pool };

