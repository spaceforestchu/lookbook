// Database configuration for Lookbook
// Follows test-pilot-server pattern

const { Pool } = require('pg');

// Database connection configuration
const dbConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'lookbook',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client can be idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection
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

// Create the connection pool
const pool = new Pool(dbConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('📊 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper to get a client from the pool (for transactions)
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient
};


