// Lookbook Backend Server
// Express + PostgreSQL API following test-pilot-server patterns

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db/dbConfig');

const app = express();
const PORT = process.env.PORT || 4002; // Different port to avoid conflicts

// =====================================================
// MIDDLEWARE
// =====================================================

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'lookbook-api'
  });
});

// Test database connection
app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'connected', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Import route modules
const authRouter = require('./routes/auth');
const profilesRouter = require('./routes/profiles');
const projectsRouter = require('./routes/projects');
const searchRouter = require('./routes/search');
const sharepackRouter = require('./routes/sharepack');
const aiRouter = require('./routes/ai');

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/search', searchRouter);
app.use('/api/sharepack', sharepackRouter);
app.use('/api/ai', aiRouter);

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================================================
// SERVER START
// =====================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🚀 Lookbook API Server Running        ║
║                                          ║
║   Port: ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}   ║
║                                          ║
║   Ready to accept requests! 🎉          ║
╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});


