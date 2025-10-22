# Database Configuration Guide

## Overview
Lookbook uses PostgreSQL as its database. This guide ensures you never have database connection issues.

## Database Details

### Production Database (segundo-db)
- **Host**: `34.57.101.141`
- **Port**: `5432`
- **Database Name**: `segundo-db`
- **User**: `lookbook_user`
- **Password**: `Lookbook123!`

### Connection String
```
DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
```

## Configuration Files

### Backend Configuration
**File**: `backend/.env`

```env
# Database Connection
DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db

# Server Configuration
PORT=4002
FRONTEND_URL=http://localhost:5175

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$X8qZ9Y4vN3J2K5L6M7N8O.P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E
```

### Frontend Configuration
**File**: `frontend/.env`

```env
VITE_API_URL=http://localhost:4002/api
```

## How the Backend Connects

The backend uses `backend/db/dbConfig.js` which reads from environment variables:

```javascript
const dbConfig = {
  // Individual connection parameters (for Railway style)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
};

// For production/hosted databases with SSL
if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (preferred method)
  dbConfig.connectionString = process.env.DATABASE_URL;
  // SSL configuration for hosted databases
  if (process.env.NODE_ENV === 'production') {
    dbConfig.ssl = {
      rejectUnauthorized: false
    };
  }
}
```

### Priority Order:
1. **DATABASE_URL** (recommended) - Single connection string
2. **Individual parameters** (DB_USER, DB_HOST, etc.) - Fallback method

## Startup Checklist

### Every Time You Start the App:

1. **Check Backend Environment**:
   ```bash
   cd backend
   cat .env | grep DATABASE_URL
   ```
   Should show: `DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db`

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Look for: "🚀 Lookbook API Server Running" without errors

3. **Test Database Connection**:
   ```bash
   curl http://localhost:4002/api/health/db
   ```
   Should return: `{"status":"connected","timestamp":"..."}`

4. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Should start on `http://localhost:5175`

## Quick Verification Script

Create `backend/check-db.js`:
```javascript
require('dotenv').config();
const { pool } = require('./db/dbConfig');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌');
    
    const result = await pool.query('SELECT NOW(), current_database(), current_user');
    const { now, current_database, current_user } = result.rows[0];
    
    console.log('✅ Connection successful!');
    console.log('⏰ Server time:', now);
    console.log('🗄️  Database:', current_database);
    console.log('👤 User:', current_user);
    
    // Test that we can access lookbook tables
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'lookbook_%'
      ORDER BY tablename
    `);
    
    console.log('\n📊 Lookbook Tables Found:', tables.rows.length);
    tables.rows.forEach(row => console.log('  -', row.tablename));
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
cd backend
node check-db.js
```

## Common Issues & Solutions

### Issue: "connection refused" or "ECONNREFUSED"
**Solution**: Check that DATABASE_URL is set correctly in `backend/.env`

### Issue: "permission denied for table"
**Solution**: Make sure you're using `lookbook_user`, not `readonly_user`

### Issue: "database does not exist"
**Solution**: Verify the database name is `segundo-db` (not `segundo`)

### Issue: "password authentication failed"
**Solution**: Verify password is exactly `Lookbook123!` with capital L and exclamation mark

### Issue: Frontend can't reach backend
**Solution**: 
- Check backend is running on port 4002
- Check `frontend/.env` has `VITE_API_URL=http://localhost:4002/api`
- Restart frontend after changing .env

## Database Schema

### Core Tables:
- `users` - From segundo-db (user_id, first_name, last_name, email)
- `lookbook_profiles` - Profile information (references users)
- `lookbook_experience` - Work experience entries
- `lookbook_projects` - Project portfolio
- `lookbook_project_participants` - Links profiles to projects
- `lookbook_skills` - Standardized skills taxonomy
- `lookbook_industries` - Standardized industries taxonomy
- `lookbook_sharepack_events` - Tracking for shared portfolios

### Schema Files:
- `database/schema-segundo.sql` - Main schema for segundo-db
- `database/add-taxonomy-tables.sql` - Taxonomy system

## Emergency Database Access

### Direct psql Connection:
```bash
PGPASSWORD='Lookbook123!' psql -h 34.57.101.141 -U lookbook_user -d segundo-db
```

### Common Queries:
```sql
-- Check people count
SELECT COUNT(*) FROM lookbook_profiles;

-- Check tables
\dt lookbook_*

-- Check a profile
SELECT p.*, u.first_name, u.last_name 
FROM lookbook_profiles p 
JOIN users u ON p.user_id = u.user_id 
LIMIT 1;
```

## For Future Reference

### If You Need to Change Databases:
1. Update `backend/.env` with new `DATABASE_URL`
2. Run `backend/check-db.js` to verify connection
3. Run migrations if needed
4. Restart backend server

### If You Deploy to Production:
1. Set `DATABASE_URL` in your hosting platform environment variables
2. Set `NODE_ENV=production`
3. The backend will automatically use SSL for the database connection
4. Update `FRONTEND_URL` and `VITE_API_URL` to production URLs

## Architecture Summary

```
┌─────────────────────────────────────────┐
│  Frontend (Vite React)                  │
│  Port: 5175                             │
│  Location: /frontend                    │
│  Env: VITE_API_URL                      │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               ▼
┌─────────────────────────────────────────┐
│  Backend (Express API)                  │
│  Port: 4002                             │
│  Location: /backend                     │
│  Env: DATABASE_URL                      │
└──────────────┬──────────────────────────┘
               │ SQL Queries
               ▼
┌─────────────────────────────────────────┐
│  PostgreSQL Database                    │
│  Host: 34.57.101.141:5432              │
│  Database: segundo-db                   │
│  User: lookbook_user                    │
└─────────────────────────────────────────┘
```

## Never Lose This Connection String Again!

Save this in your password manager or bookmark this file:
```
postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
```

