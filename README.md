# Lookbook - Talent & Project Showcase

A full-stack application for showcasing team member profiles and projects, built with React, Express, and PostgreSQL.

## Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Vite + React)                │
│  Port: 5175                             │
│  Location: /frontend                    │
└──────────────┬──────────────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────────────┐
│  Backend (Express + Node.js)            │
│  Port: 4002                             │
│  Location: /backend                     │
└──────────────┬──────────────────────────┘
               │ PostgreSQL
               ▼
┌─────────────────────────────────────────┐
│  Database (PostgreSQL)                  │
│  segundo-db                             │
└─────────────────────────────────────────┘
```

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Notifications**: Sonner (toast notifications)
- **Image Compression**: browser-image-compression

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via `pg` library)
- **Authentication**: bcrypt (password hashing)
- **Dev Server**: Nodemon (auto-reload)
- **CORS**: Configured for local development

### Database
- **PostgreSQL**: Cloud-hosted segundo-db
- **ORM**: Raw SQL queries (no ORM)
- **Schema**: Custom Lookbook tables + existing users table

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Access to segundo-db database (connection string provided)

### 1. Install Dependencies
```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
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

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:4002/api
```

### 3. Verify Database Connection
```bash
cd backend
node check-db.js
```

Should show:
```
✅ Connection successful!
🗄️  Database: segundo-db
👤 User: lookbook_user
📊 Lookbook Tables Found: 7
```

### 4. Start Development Servers

#### Option A: Start Both Together
```bash
npm run dev
```

#### Option B: Start Separately (recommended)
Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend (Public)**: http://localhost:5175
- **Frontend (Admin)**: http://localhost:5175/admin
- **Backend API**: http://localhost:4002/api
- **API Health Check**: http://localhost:4002/api/health

#### Admin Login
- Username: `admin`
- Password: `admin123`

## Project Structure

```
lookbook/
├── frontend/              # Vite React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   │   ├── Admin*.jsx # Admin portal pages
│   │   │   ├── Person*.jsx# Person pages
│   │   │   └── Project*.jsx# Project pages
│   │   ├── utils/         # API client, helpers
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # Express API server
│   ├── db/
│   │   └── dbConfig.js    # PostgreSQL connection
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication
│   │   ├── profiles.js    # People/profiles
│   │   ├── projects.js    # Projects
│   │   ├── taxonomy.js    # Skills & Industries
│   │   ├── search.js      # Search functionality
│   │   ├── sharepack.js   # PDF generation
│   │   └── ai.js          # AI features
│   ├── queries/           # Database queries
│   │   ├── profileQueries.js
│   │   ├── projectQueries.js
│   │   └── taxonomyQueries.js
│   ├── server.js          # Express app
│   ├── check-db.js        # DB connection tester
│   └── package.json
│
├── database/              # SQL files
│   ├── schema-segundo.sql         # Main schema
│   ├── add-taxonomy-tables.sql    # Taxonomy system
│   └── setup-march-2025-cohort.sql# Sample data
│
├── DATABASE_CONFIG.md     # ⭐ Database setup guide
└── package.json           # Root package (scripts)
```

## Key Features

### Public Site
- **People Directory**: Browse team member profiles with filtering
- **Project Showcase**: View project portfolios with details
- **Search**: Find people and projects
- **Responsive Design**: Mobile-friendly interface

### Admin Portal (`/admin`)
- **People Management**: CRUD operations for profiles
- **Project Management**: CRUD operations for projects
- **Taxonomy Management**: Manage standardized skills and industries
- **Bulk Upload**: CSV import for people and projects
- **Image Upload**: Compress and upload profile photos
- **Experience Tracking**: Add work experience entries

### API Features
- RESTful API design
- Pagination support
- Advanced filtering
- PDF generation for sharepacks
- Authentication middleware

## Database Schema

### Core Tables

#### `users` (existing table from segundo-db)
- `user_id` (PK)
- `first_name`, `last_name`, `email`

#### `lookbook_profiles`
- `id` (PK)
- `user_id` (FK → users)
- `slug` (unique URL identifier)
- `title`, `bio`
- `skills` (text[])
- `industry_expertise` (text[])
- `highlights` (text[])
- `photo_url`, `photo_lqip`
- `open_to_work` (boolean)
- Social links (LinkedIn, GitHub, website, X)

#### `lookbook_experience`
- `id` (PK)
- `profile_id` (FK → lookbook_profiles)
- `org`, `role`
- `date_from`, `date_to`
- `summary`
- `display_order`

#### `lookbook_projects`
- `id` (PK)
- `slug` (unique)
- `title`, `summary`
- `skills` (text[])
- `sectors` (text[])
- `main_image_url`, `icon_url`
- `demo_video_url`, `github_url`, `live_url`
- `cohort`, `status`

#### `lookbook_project_participants`
- Links profiles to projects
- Tracks role and display order

#### `lookbook_skills` (taxonomy)
- Standardized skills with categories
- 42 pre-loaded skills

#### `lookbook_industries` (taxonomy)
- Standardized industries
- 20 pre-loaded industries

## API Endpoints

### Profiles
- `GET /api/profiles` - List all profiles (with filters)
- `GET /api/profiles/:slug` - Get single profile
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:slug` - Update profile
- `DELETE /api/profiles/:slug` - Delete profile

### Projects
- `GET /api/projects` - List all projects (with filters)
- `GET /api/projects/:slug` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:slug` - Update project
- `DELETE /api/projects/:slug` - Delete project

### Taxonomy
- `GET /api/taxonomy/skills` - Get all skills
- `POST /api/taxonomy/skills` - Create skill
- `PUT /api/taxonomy/skills/:id` - Update skill
- `DELETE /api/taxonomy/skills/:id` - Delete skill
- (Same endpoints for industries)

### Search
- `POST /api/search` - Semantic search across people and projects

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify auth token

## Development Workflow

### Adding a New Feature
1. Create backend API endpoint in `backend/routes/`
2. Add database queries in `backend/queries/`
3. Update frontend API client in `frontend/src/utils/api.js`
4. Create frontend components/pages
5. Test locally
6. Commit and deploy

### Database Migrations
SQL migration files in `database/` folder:
```bash
# Run migration
PGPASSWORD='Lookbook123!' psql -h 34.57.101.141 -U lookbook_user \
  -d segundo-db -f database/your-migration.sql
```

### Common Tasks

#### Add New Admin User
```bash
cd backend
node generate-password.js your-password
# Copy hash to .env ADMIN_PASSWORD_HASH
```

#### Check Database Status
```bash
cd backend
node check-db.js
```

#### Clear Node Modules (if issues)
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## Troubleshooting

### Database Connection Issues
See `DATABASE_CONFIG.md` for detailed troubleshooting.

Quick check:
```bash
cd backend
node check-db.js
```

### Frontend Can't Reach Backend
1. Verify backend is running on port 4002
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Restart frontend after changing .env

### Port Already in Use
```bash
# Kill process on port 4002 (backend)
lsof -ti:4002 | xargs kill

# Kill process on port 5175 (frontend)
lsof -ti:5175 | xargs kill
```

## Deployment

### Backend (Render/Railway)
1. Set environment variable: `DATABASE_URL`
2. Set `NODE_ENV=production`
3. Deploy from `backend/` folder

### Frontend (Render/Vercel)
1. Set environment variable: `VITE_API_URL` (your backend URL)
2. Build command: `npm run build`
3. Deploy from `frontend/` folder

## Documentation

- `DATABASE_CONFIG.md` - Comprehensive database setup guide
- `TAXONOMY_SYSTEM_COMPLETE.md` - Skills & Industries feature
- `MARCH_2025_SETUP_COMPLETE.md` - Initial data setup
- `RENDER_DEPLOYMENT.md` - Deployment guide

## Contributing

This is a private project for Pursuit's Lookbook application.

## License

MIT

## Support

For issues or questions:
1. Check `DATABASE_CONFIG.md` for database issues
2. Run `backend/check-db.js` to verify connection
3. Check server logs for error messages
