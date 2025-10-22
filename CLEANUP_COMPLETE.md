# Sanity & Next.js Cleanup - Complete ✅

## What Was Removed

### Sanity CMS (Removed)
- ❌ `/sanity` folder - All Sanity schema types and configuration
- ❌ `sanity.config.ts` - Sanity Studio configuration
- **Why**: The app now uses PostgreSQL directly via Express API, no CMS needed

### Next.js App (Removed)
- ❌ `/app` folder - Entire Next.js application
- ❌ `next.config.ts` - Next.js configuration
- ❌ `tsconfig.json` - TypeScript config for Next.js
- ❌ `tailwind.config.ts` - Tailwind config for Next.js
- ❌ `postcss.config.js` - PostCSS config for Next.js
- ❌ `eslint.config.mjs` - ESLint config for Next.js
- **Why**: The app now uses Vite React app in `/frontend` folder

### Next.js-Specific Folders (Removed)
- ❌ `/components` - Next.js components (duplicates of frontend components)
- ❌ `/lib` - Next.js utilities (replaced by backend queries)
- ❌ `/db` - Next.js database utilities (replaced by backend/db)
- ❌ `/scripts` - Next.js scripts (no longer needed)
- **Why**: All functionality moved to `/frontend` and `/backend`

## Current Clean Architecture

```
lookbook/
├── frontend/           ✅ Vite React app (port 5175)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/api.js
│   └── package.json
│
├── backend/            ✅ Express API (port 4002)
│   ├── routes/
│   ├── queries/
│   ├── db/
│   └── server.js
│
├── database/           ✅ SQL migrations
│   ├── schema-segundo.sql
│   └── add-taxonomy-tables.sql
│
├── DATABASE_CONFIG.md  ✅ Database setup guide
└── README.md           ✅ Updated documentation
```

## Database Configuration (Never Lose This Again!)

### ⭐ The One Connection String You Need
```
DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
```

### Where It Goes
**File**: `backend/.env`
```env
DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
PORT=4002
FRONTEND_URL=http://localhost:5175
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$X8qZ9Y4vN3J2K5L6M7N8O.P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E
```

## How to Start the App (Every Time)

### Step 1: Verify Database Connection
```bash
cd backend
node check-db.js
```

Expected output:
```
✅ Connection successful!
🗄️  Database: segundo-db
👤 User: lookbook_user
📊 Lookbook Tables Found: 7
📈 Record Counts:
  - Profiles: 34
  - Projects: 0
  - Skills: 42
  - Industries: 20
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

Wait for:
```
╔══════════════════════════════════════════╗
║   🚀 Lookbook API Server Running        ║
║   Port: 4002                            ║
║   Ready to accept requests! 🎉          ║
╚══════════════════════════════════════════╝
```

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

Wait for:
```
  ➜  Local:   http://localhost:5175/
  ➜  Network: use --host to expose
```

### Step 4: Access the App
- **Public Site**: http://localhost:5175
- **Admin Portal**: http://localhost:5175/admin
  - Username: `admin`
  - Password: `admin123`

## Quick Troubleshooting

### Problem: Database Connection Failed
**Solution**:
1. Check `backend/.env` has `DATABASE_URL` set
2. Run `cd backend && node check-db.js`
3. See `DATABASE_CONFIG.md` for detailed help

### Problem: Port Already in Use
**Solution**:
```bash
# Kill backend (port 4002)
lsof -ti:4002 | xargs kill

# Kill frontend (port 5175)  
lsof -ti:5175 | xargs kill
```

### Problem: Frontend Shows Blank Page
**Solution**:
1. Verify backend is running: `curl http://localhost:4002/api/health`
2. Check `frontend/.env` has `VITE_API_URL=http://localhost:4002/api`
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Problem: "Module not found" Errors
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## What's Left in the Codebase

### Keep These ✅
- `frontend/` - Your Vite React application
- `backend/` - Your Express API server
- `database/` - SQL migration files
- `README.md` - Main documentation (updated)
- `DATABASE_CONFIG.md` - Database guide (new)
- `TAXONOMY_SYSTEM_COMPLETE.md` - Taxonomy feature docs
- `package.json` - Root package with scripts
- SQL files (*.sql) - Database migrations and data

### Can Delete These (Optional Cleanup)
- `*.md` files in root (except README, DATABASE_CONFIG)
  - Old documentation from Next.js/Sanity era
  - Safe to delete if you don't need the history
- `test-*.csv` files - Sample CSV upload files
- `update-*.sql` files - Old migration files
- `add-*.sql` files - Old migration files
- `Lookbook mockup.jpg` - Old design file
- `Pursuit Wordmark Black.png` - Duplicate logo

## Benefits of the Cleanup

### Before Cleanup
- ❌ Two competing frontends (Next.js + Vite)
- ❌ Two data sources (Sanity + PostgreSQL)
- ❌ Confusing file structure
- ❌ Unclear which code is used
- ❌ Database connection confusion

### After Cleanup  
- ✅ Single frontend (Vite React)
- ✅ Single data source (PostgreSQL)
- ✅ Clear folder structure
- ✅ All active code is obvious
- ✅ Clear database documentation

## Future-Proofing

### When You Come Back to This Project
1. Read `DATABASE_CONFIG.md` first
2. Run `backend/check-db.js` to verify connection
3. Follow the "How to Start" steps above
4. Check `README.md` for feature documentation

### When Deploying
1. Backend: Set `DATABASE_URL` environment variable
2. Frontend: Set `VITE_API_URL` to your backend URL
3. See `RENDER_DEPLOYMENT.md` for details

### When Adding Features
1. Backend API: Add routes in `backend/routes/`
2. Database: Add queries in `backend/queries/`
3. Frontend: Add pages in `frontend/src/pages/`
4. API Client: Update `frontend/src/utils/api.js`

## Key Files Reference

### Most Important Files
1. **`DATABASE_CONFIG.md`** - Your database bible
2. **`backend/.env`** - Backend configuration (DATABASE_URL here!)
3. **`frontend/.env`** - Frontend configuration
4. **`backend/check-db.js`** - Database connection tester
5. **`README.md`** - Main documentation

### Never Delete These
- `frontend/` folder
- `backend/` folder
- `database/` folder
- `backend/.env` (contains DATABASE_URL!)
- `DATABASE_CONFIG.md`

## Success Checklist

When starting the app, you should see:
- ✅ `backend/check-db.js` shows "Connection successful"
- ✅ Backend starts without errors on port 4002
- ✅ Frontend starts without errors on port 5175
- ✅ Admin login works at `/admin`
- ✅ People page shows 34 profiles
- ✅ Taxonomy page shows 42 skills and 20 industries

## Summary

The codebase is now clean and focused:
- **One frontend**: Vite React in `/frontend`
- **One backend**: Express API in `/backend`
- **One database**: PostgreSQL segundo-db
- **Clear docs**: `DATABASE_CONFIG.md` and `README.md`

No more Sanity. No more Next.js. No more confusion. 🎉

---

**Created**: October 22, 2025  
**Status**: ✅ Complete  
**Your Database Connection**: `postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db`

