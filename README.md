# Lookbook - Talent & Project Showcase

A full-stack application for showcasing people profiles and projects, built with Express + PostgreSQL backend and React + Vite frontend.

**Built to match your existing tech stack** for easy future integration with pilot-agent project.

## 🎯 Overview

Lookbook allows you to:
- **Browse talented people** with filtering by skills, industries, and work availability
- **Discover projects** with technology and sector filtering
- **Search** across people and projects
- **Generate PDF sharepacks** for recruiting and sharing
- **Track analytics** on most viewed profiles and projects

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (with optional pgvector for semantic search)
- OpenAI API (for AI resume extraction)
- pdf-lib (for PDF generation)

**Frontend:**
- React 18
- Vite (build tool)
- React Router (navigation)
- Axios (API calls)

### Key Design Decisions

1. **References existing users**: The `lookbook_profiles` table links to your existing `users` table via `user_id`, avoiding data duplication
2. **Standalone but compatible**: Built as a separate app but follows your exact patterns for easy merging
3. **Same conventions**: Matches test-pilot-server (backend) and pilot-client (frontend) structures

## 📁 Project Structure

```
lookbook/
├── backend/                 # Express API server
│   ├── server.js           # Main server file
│   ├── db/
│   │   └── dbConfig.js     # PostgreSQL connection
│   ├── queries/            # Database queries (your pattern)
│   │   ├── profileQueries.js
│   │   ├── projectQueries.js
│   │   └── ...
│   ├── routes/             # API routes
│   │   ├── profiles.js
│   │   ├── projects.js
│   │   ├── search.js
│   │   ├── sharepack.js
│   │   └── ai.js
│   └── package.json
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── database/
│   └── schema.sql         # Database schema
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn
- (Optional) OpenAI API key for AI features

### Step 1: Database Setup

1. **Create the database:**

```bash
createdb lookbook
```

2. **Run the schema:**

```bash
psql lookbook < database/schema.sql
```

**Important Note:** The schema assumes you have an existing `users` table. If you're testing standalone, uncomment the sample users table creation in `schema.sql`.

### Step 2: Backend Setup

1. **Navigate to backend:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp env.example .env
```

4. **Edit `.env` with your database credentials:**

```env
# Database (use your existing database)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=lookbook
PG_USER=postgres
PG_PASSWORD=your_password

# Or use DATABASE_URL for hosted databases
# DATABASE_URL=postgresql://user:pass@host:5432/db

# Server
PORT=4002
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: OpenAI for AI features
# OPENAI_API_KEY=sk-...
```

5. **Start the backend:**

```bash
npm run dev
# or: npm start
```

Backend will run on **http://localhost:4002**

### Step 3: Frontend Setup

1. **Navigate to frontend:**

```bash
cd ../frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the frontend:**

```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

### Step 4: Test It Out

1. Open **http://localhost:5173** in your browser
2. You should see the Lookbook homepage
3. Navigate to People and Projects pages

## 📊 Database Schema

### Key Tables

**`lookbook_profiles`**: Extended profile info linking to your existing users
- Links to `users(id)` via `user_id`
- Stores skills, industries, bio, photos, etc.

**`lookbook_projects`**: Project information
- Title, summary, skills, sectors
- GitHub/live URLs, demo videos

**`lookbook_project_participants`**: Many-to-many relationship
- Links projects to profiles

**`lookbook_experience`**: Work history and education
- Links to profiles

**`lookbook_sharepack_events`**: Analytics/tracking
- Logs PDF generations and lead captures

See `database/schema.sql` for complete details.

## 🔌 API Endpoints

### Profiles (People)

```
GET    /api/profiles              # List all profiles (with filters)
GET    /api/profiles/:slug        # Get profile by slug
POST   /api/profiles              # Create profile
PUT    /api/profiles/:slug        # Update profile
DELETE /api/profiles/:slug        # Delete profile
GET    /api/profiles/filters      # Get available filter options
```

**Query Parameters for GET /api/profiles:**
- `search`: Text search
- `skills`: Array of skills (must have ALL)
- `industries`: Array of industries
- `openToWork`: Boolean
- `page`, `limit`: Pagination

### Projects

```
GET    /api/projects              # List all projects (with filters)
GET    /api/projects/:slug        # Get project by slug
POST   /api/projects              # Create project
PUT    /api/projects/:slug        # Update project
DELETE /api/projects/:slug        # Delete project
GET    /api/projects/filters      # Get available filter options
POST   /api/projects/:slug/participants  # Add participant
```

### Search

```
POST   /api/search                # Unified search
GET    /api/search/suggestions    # Get search suggestions
```

### Sharepack (PDF)

```
POST   /api/sharepack             # Generate PDF
POST   /api/sharepack/lead        # Log CRM lead
GET    /api/sharepack/insights    # Get analytics
```

### AI (Optional)

```
POST   /api/ai/extract            # Extract profile from resume text
POST   /api/ai/sanitize           # Normalize/validate profile data
```

## 🎨 Frontend Pages

- **`/`**: Homepage with overview
- **`/people`**: Browse people with filtering
- **`/people/:slug`**: Person detail page
- **`/projects`**: Browse projects
- **`/projects/:slug`**: Project detail page
- **`/search`**: Search page
- **`/share`**: Generate PDF sharepack

## 🔧 Configuration

### Environment Variables

**Backend (`.env`):**
```env
# Required
PG_DATABASE=lookbook
PG_USER=postgres
PG_PASSWORD=password
PORT=4002

# Optional
OPENAI_API_KEY=sk-...
CRM_WEBHOOK_URL=https://crm.com/api
```

**Frontend:**
The frontend uses Vite's proxy to connect to the backend automatically. No additional config needed for development.

For production, set `VITE_API_URL` environment variable:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 🔀 Merging Into Existing Project

### When you're ready to integrate with test-pilot-server and pilot-client:

### Backend Integration

1. **Copy database tables:**
   - Run `database/schema.sql` on your production database
   - Tables will coexist with your existing tables

2. **Copy backend files:**
   ```bash
   # From lookbook/backend to test-pilot-server/
   cp -r queries/profileQueries.js ../test-pilot-server/queries/
   cp -r queries/projectQueries.js ../test-pilot-server/queries/
   cp -r routes/profiles.js ../test-pilot-server/routes/
   cp -r routes/projects.js ../test-pilot-server/routes/
   # etc.
   ```

3. **Register routes in server.js:**
   ```javascript
   // In test-pilot-server/server.js
   const profilesRouter = require('./routes/profiles');
   const projectsRouter = require('./routes/projects');
   
   app.use('/api/profiles', profilesRouter);
   app.use('/api/projects', projectsRouter);
   ```

4. **Update dbConfig.js:**
   - Routes already use your `dbConfig.js` pattern
   - No changes needed if following same structure

### Frontend Integration

1. **Copy frontend files:**
   ```bash
   # From lookbook/frontend/src to pilot-client/src/
   cp -r pages/PeoplePage.jsx ../pilot-client/src/pages/
   cp -r pages/PersonDetailPage.jsx ../pilot-client/src/pages/
   cp -r pages/ProjectsPage.jsx ../pilot-client/src/pages/
   # etc.
   
   cp -r components/PersonCard.jsx ../pilot-client/src/components/
   cp -r components/ProjectCard.jsx ../pilot-client/src/components/
   # etc.
   ```

2. **Update routing:**
   ```jsx
   // In pilot-client/src/App.jsx or your router file
   import PeoplePage from './pages/PeoplePage';
   import PersonDetailPage from './pages/PersonDetailPage';
   // ...
   
   <Route path="/people" element={<PeoplePage />} />
   <Route path="/people/:slug" element={<PersonDetailPage />} />
   ```

3. **Update API base URL:**
   - If using same backend, API calls will work automatically
   - Update `frontend/src/utils/api.js` if needed

### Authentication Integration

To protect admin routes (create/update/delete):

1. **Add your auth middleware:**
   ```javascript
   // In routes/profiles.js
   const { authenticateToken } = require('../middleware/auth');
   
   router.post('/', authenticateToken, async (req, res) => {
     // Only authenticated users can create profiles
   });
   ```

2. **Check user roles:**
   ```javascript
   if (req.user.role !== 'admin') {
     return res.status(403).json({ error: 'Forbidden' });
   }
   ```

## 🧪 Sample Data

To populate with sample data for testing:

```sql
-- Insert sample users (if not using existing)
INSERT INTO users (name, email) VALUES 
  ('Jane Doe', 'jane@example.com'),
  ('John Smith', 'john@example.com');

-- Create profiles
INSERT INTO lookbook_profiles (user_id, slug, title, skills, open_to_work)
SELECT 
  id,
  lower(replace(name, ' ', '-')),
  'Software Engineer',
  ARRAY['JavaScript', 'React', 'Node.js'],
  true
FROM users
WHERE email IN ('jane@example.com', 'john@example.com');

-- Create project
INSERT INTO lookbook_projects (slug, title, summary, skills, cohort)
VALUES ('sample-project', 'Sample Project', 'An amazing application', ARRAY['React', 'PostgreSQL'], '2024');
```

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check your `.env` file has correct database credentials
- Ensure PostgreSQL is running: `pg_isready`
- Try connecting manually: `psql -h localhost -U postgres lookbook`

### "Profile not found" errors
- Make sure you have data in `users` and `lookbook_profiles` tables
- Check that `user_id` foreign keys are valid

### Frontend can't reach backend
- Ensure backend is running on port 4002
- Check Vite proxy configuration in `vite.config.js`
- Look for CORS errors in browser console

### Port conflicts
- Backend: Change `PORT` in `.env`
- Frontend: Vite will automatically find available port

## 📝 Next Steps

1. **Add authentication** using your existing JWT system
2. **Implement semantic search** (requires OpenAI + pgvector)
3. **Add image uploads** (use Cloudinary, S3, or your existing solution)
4. **Customize styling** to match your brand
5. **Add more filters** as needed for your use case

## 🤝 Contributing

This project follows the patterns established in test-pilot-server and pilot-client for consistency and easy integration.

## 📄 License

Same as your existing project.

---

**Questions?** Refer to `INTEGRATION_PLAN.md` for detailed merge instructions.
