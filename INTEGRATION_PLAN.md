# Lookbook Integration Plan

## Overview
Replace Sanity CMS with your existing PostgreSQL database and Express backend to integrate lookbook functionality into your pilot-agent app.

## Architecture Changes

### Current Stack (Lookbook)
- ❌ Sanity CMS (hosted content management)
- ❌ GROQ queries
- ✅ Next.js frontend (keep)
- ✅ PostgreSQL for search (already there)

### Target Stack (Integrated)
- ✅ Your PostgreSQL database (add new tables)
- ✅ Your Express API endpoints (add new routes)
- ✅ React/Vite frontend (port lookbook pages)
- ✅ Existing authentication (reuse JWT)

## Phase 1: Database Migration

### New Tables Required

```sql
-- People/Candidates Table
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(96) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  skills TEXT[] NOT NULL,
  open_to_work BOOLEAN DEFAULT false,
  highlights TEXT[],
  industry_expertise TEXT[],
  photo_url TEXT,
  photo_lqip TEXT, -- low quality image placeholder for blur effect
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  x_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience/Education Table
CREATE TABLE person_experience (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  org VARCHAR(255),
  role VARCHAR(255),
  date_from VARCHAR(50),
  date_to VARCHAR(50),
  summary TEXT,
  display_order INTEGER DEFAULT 0
);

-- Projects Table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(96) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  main_image_url TEXT,
  main_image_lqip TEXT,
  skills TEXT[] NOT NULL,
  sectors TEXT[],
  github_url TEXT,
  live_url TEXT,
  cohort VARCHAR(10), -- '2024', '2023', etc.
  has_demo_video BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Participants (Many-to-Many)
CREATE TABLE project_participants (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  UNIQUE(project_id, person_id)
);

-- Optional: Search index tables (for semantic search)
CREATE TABLE people_search_index (
  slug TEXT PRIMARY KEY,
  name TEXT,
  title TEXT,
  skills TEXT[],
  open_to_work BOOLEAN,
  content TEXT,
  embedding VECTOR(1536) -- requires pgvector extension
);

CREATE TABLE projects_search_index (
  slug TEXT PRIMARY KEY,
  title TEXT,
  summary TEXT,
  skills TEXT[],
  sectors TEXT[],
  content TEXT,
  embedding VECTOR(1536)
);

-- Optional: Analytics table
CREATE TABLE sharepack_events (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  kind VARCHAR(50), -- 'sharepack' | 'lead'
  requester_email TEXT,
  people_count INT,
  projects_count INT,
  people_slugs TEXT[],
  project_slugs TEXT[]
);

-- Indexes for performance
CREATE INDEX idx_people_slug ON people(slug);
CREATE INDEX idx_people_open_to_work ON people(open_to_work);
CREATE INDEX idx_people_skills ON people USING GIN(skills);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills);
CREATE INDEX idx_projects_sectors ON projects USING GIN(sectors);
CREATE INDEX idx_project_participants_person ON project_participants(person_id);
CREATE INDEX idx_project_participants_project ON project_participants(project_id);
```

### Migration Script Location
Add to your backend: `test-pilot-server/migrations/create_lookbook_tables.sql`

## Phase 2: Backend API Endpoints

### New Routes in `test-pilot-server/routes/`

Create `test-pilot-server/routes/lookbook.js`:

```javascript
// People endpoints
GET  /api/lookbook/people              // List all people (with filtering)
GET  /api/lookbook/people/:slug        // Get person by slug
POST /api/lookbook/people              // Create person (admin only)
PUT  /api/lookbook/people/:slug        // Update person (admin only)
DELETE /api/lookbook/people/:slug      // Delete person (admin only)

// Projects endpoints
GET  /api/lookbook/projects            // List all projects (with filtering)
GET  /api/lookbook/projects/:slug      // Get project by slug
POST /api/lookbook/projects            // Create project (admin only)
PUT  /api/lookbook/projects/:slug      // Update project (admin only)
DELETE /api/lookbook/projects/:slug    // Delete project (admin only)

// Search endpoints
POST /api/lookbook/search              // Semantic/keyword search
POST /api/lookbook/search/index        // Rebuild search index (admin)

// Share/Export endpoints
POST /api/lookbook/sharepack           // Generate PDF sharepack
POST /api/lookbook/crm/lead            // Log CRM lead

// AI extraction (already have OpenAI key)
POST /api/lookbook/ai/extract          // Extract person from resume text
```

### Query Files Structure

```
test-pilot-server/queries/
  lookbook/
    peopleQueries.js      // All people-related queries
    projectsQueries.js    // All project-related queries
    searchQueries.js      // Search/filter queries
```

## Phase 3: Frontend Integration

### Option A: Integrate into pilot-client (Recommended)

Add lookbook pages to your existing React app:

```
pilot-client/src/
  pages/
    Lookbook/
      PeoplePage.jsx       // Browse people
      PersonDetailPage.jsx // Person profile
      ProjectsPage.jsx     // Browse projects
      ProjectDetailPage.jsx // Project detail
      SearchPage.jsx       // Smart search
      SharePage.jsx        // PDF generation
      Admin/
        IntakePage.jsx     // AI resume extraction
        InsightsPage.jsx   // Analytics
  components/
    Lookbook/
      PersonCard.jsx
      ProjectCard.jsx
      FilterSidebar.jsx
      FilterBar.jsx
```

### Option B: Keep as Separate Next.js App

Keep lookbook as standalone app but point to your backend:
- Replace all Sanity queries with fetch calls to your Express API
- Deploy separately but share authentication via JWT

## Phase 4: Feature Mapping

### Core Features Migration

| Feature | Current (Sanity) | New (Your API) |
|---------|-----------------|----------------|
| Content Management | Sanity Studio | Admin pages in pilot-client |
| Data Storage | Sanity Cloud | Your PostgreSQL DB |
| Queries | GROQ | SQL via your queries/ folder |
| Authentication | None | Your existing JWT auth |
| Images | Sanity CDN | Your image storage solution |
| AI Extraction | Claude API | Reuse your OpenAI integration |
| Search | pgvector tables | Keep pgvector tables |

### Image Handling Options

1. **Use existing storage** (if you have one)
2. **Add Cloudinary** (free tier: 25GB)
3. **Use AWS S3** (cheap storage)
4. **Store in PostgreSQL** (bytea for small images)

## Phase 5: Authentication Integration

### Protect Admin Routes

```javascript
// In test-pilot-server, reuse your existing JWT middleware
const { authenticateToken } = require('../middleware/auth');

router.post('/api/lookbook/people', authenticateToken, async (req, res) => {
  // Only authenticated users can create people
  // Check req.user for role-based access
});
```

### Role-Based Access

Add roles to your existing users table:
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
-- Roles: 'user', 'admin', 'recruiter', etc.
```

## Phase 6: Data Migration

If you have existing data in the original lookbook's Sanity:

```javascript
// Migration script: scripts/migrate-from-sanity.js
// 1. Export from Sanity using their API
// 2. Transform data format
// 3. Insert into your PostgreSQL tables
```

## Phase 7: Deployment Considerations

### Environment Variables to Add

```bash
# Add to your existing .env
OPENAI_API_KEY=<your-existing-key>
ANTHROPIC_API_KEY=<optional-for-resume-extraction>

# Image storage (pick one)
CLOUDINARY_URL=<if-using-cloudinary>
AWS_S3_BUCKET=<if-using-s3>

# Optional: CRM webhook
CRM_WEBHOOK_URL=<your-crm-endpoint>
```

## Benefits of This Approach

✅ **Single Database**: All data in your PostgreSQL
✅ **Single Backend**: All APIs in your Express server
✅ **Unified Auth**: Reuse your existing JWT system
✅ **No Extra Costs**: No Sanity subscription needed
✅ **Full Control**: You own all the data and code
✅ **Consistent Patterns**: Follows your existing architecture

## Implementation Steps

### Step 1: Database Setup (1-2 hours)
1. Create migration SQL file
2. Run migration on your dev database
3. Test queries manually

### Step 2: Backend API (4-6 hours)
1. Create query files in queries/lookbook/
2. Create routes in routes/lookbook.js
3. Add middleware for auth/validation
4. Test endpoints with Postman

### Step 3: Frontend Pages (6-8 hours)
1. Create basic list/detail pages
2. Add filtering components
3. Connect to your backend API
4. Style with your existing design system

### Step 4: Advanced Features (4-6 hours)
1. Add search functionality
2. Implement PDF generation
3. Add AI extraction endpoint
4. Analytics/insights page

### Total Estimate: 15-22 hours of development

## Next Steps

Would you like me to:

1. ✅ **Generate the SQL migration file**
2. ✅ **Create the backend API structure** (queries + routes)
3. ✅ **Port the frontend components** to React (from Next.js)
4. ✅ **Set up authentication integration**
5. ✅ **All of the above**

Let me know and I'll start building!


