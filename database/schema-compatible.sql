-- =====================================================
-- LOOKBOOK SCHEMA - COMPATIBLE WITH SEGUNDO-DB
-- This schema matches your existing database structure
-- =====================================================

-- For local testing, create a compatible users table
-- (Skip this when deploying to production - table already exists)
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'builder',
  cohort VARCHAR(50),
  active BOOLEAN DEFAULT true
);

-- =====================================================
-- LOOKBOOK PROFILES
-- Links to your existing users via user_id
-- =====================================================

CREATE TABLE IF NOT EXISTS lookbook_profiles (
  profile_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  slug VARCHAR(96) UNIQUE NOT NULL,
  
  -- Professional info
  title VARCHAR(255),
  bio TEXT,
  
  -- Skills & expertise
  skills TEXT[] NOT NULL DEFAULT '{}',
  industry_expertise TEXT[] DEFAULT '{}',
  
  -- Work status
  open_to_work BOOLEAN DEFAULT false,
  highlights TEXT[] DEFAULT '{}',
  
  -- Visual
  photo_url TEXT,
  photo_lqip TEXT,
  
  -- Links (can sync with existing user_profiles)
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  x_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_lookbook_profile UNIQUE(user_id)
);

-- =====================================================
-- EXPERIENCE & EDUCATION
-- =====================================================

CREATE TABLE IF NOT EXISTS lookbook_experience (
  experience_id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES lookbook_profiles(profile_id) ON DELETE CASCADE,
  
  org VARCHAR(255),
  role VARCHAR(255),
  date_from VARCHAR(50),
  date_to VARCHAR(50),
  summary TEXT,
  
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE IF NOT EXISTS lookbook_projects (
  project_id SERIAL PRIMARY KEY,
  slug VARCHAR(96) UNIQUE NOT NULL,
  
  -- Basic info
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  description TEXT,
  
  -- Visual
  main_image_url TEXT,
  main_image_lqip TEXT,
  demo_video_url TEXT,
  
  -- Tech & industry
  skills TEXT[] NOT NULL DEFAULT '{}',
  sectors TEXT[] DEFAULT '{}',
  
  -- Links
  github_url TEXT,
  live_url TEXT,
  
  -- Metadata
  cohort VARCHAR(10), -- '2024', '2023', etc.
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECT PARTICIPANTS (Many-to-Many)
-- =====================================================

CREATE TABLE IF NOT EXISTS lookbook_project_participants (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES lookbook_projects(project_id) ON DELETE CASCADE,
  profile_id INTEGER NOT NULL REFERENCES lookbook_profiles(profile_id) ON DELETE CASCADE,
  
  role VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_project_participant UNIQUE(project_id, profile_id)
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS lookbook_sharepack_events (
  event_id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  kind VARCHAR(50) NOT NULL,
  requester_email TEXT,
  requester_user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  
  people_count INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  people_slugs TEXT[] DEFAULT '{}',
  project_slugs TEXT[] DEFAULT '{}',
  
  metadata JSONB DEFAULT '{}'::JSONB
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_slug ON lookbook_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_user_id ON lookbook_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_open_to_work ON lookbook_profiles(open_to_work);
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_skills ON lookbook_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_industry ON lookbook_profiles USING GIN(industry_expertise);

CREATE INDEX IF NOT EXISTS idx_lookbook_experience_profile_id ON lookbook_experience(profile_id);

CREATE INDEX IF NOT EXISTS idx_lookbook_projects_slug ON lookbook_projects(slug);
CREATE INDEX IF NOT EXISTS idx_lookbook_projects_status ON lookbook_projects(status);
CREATE INDEX IF NOT EXISTS idx_lookbook_projects_cohort ON lookbook_projects(cohort);
CREATE INDEX IF NOT EXISTS idx_lookbook_projects_skills ON lookbook_projects USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_lookbook_projects_sectors ON lookbook_projects USING GIN(sectors);

CREATE INDEX IF NOT EXISTS idx_lookbook_participants_project ON lookbook_project_participants(project_id);
CREATE INDEX IF NOT EXISTS idx_lookbook_participants_profile ON lookbook_project_participants(profile_id);

CREATE INDEX IF NOT EXISTS idx_lookbook_sharepack_created ON lookbook_sharepack_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lookbook_sharepack_kind ON lookbook_sharepack_events(kind);

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- View: Complete profile with user info (handles first_name + last_name)
CREATE OR REPLACE VIEW lookbook_profiles_complete AS
SELECT 
  p.*,
  u.first_name || ' ' || u.last_name as name,
  u.first_name,
  u.last_name,
  u.email,
  u.cohort as user_cohort,
  u.role as user_role,
  (
    SELECT json_agg(
      json_build_object(
        'experience_id', e.experience_id,
        'org', e.org,
        'role', e.role,
        'dateFrom', e.date_from,
        'dateTo', e.date_to,
        'summary', e.summary
      ) ORDER BY e.display_order
    )
    FROM lookbook_experience e
    WHERE e.profile_id = p.profile_id
  ) as experience
FROM lookbook_profiles p
JOIN users u ON p.user_id = u.user_id;

-- View: Projects with participant details
CREATE OR REPLACE VIEW lookbook_projects_complete AS
SELECT 
  proj.*,
  (
    SELECT json_agg(
      json_build_object(
        'slug', prof.slug,
        'name', u.first_name || ' ' || u.last_name,
        'title', prof.title,
        'photoUrl', prof.photo_url,
        'role', pp.role
      ) ORDER BY pp.display_order
    )
    FROM lookbook_project_participants pp
    JOIN lookbook_profiles prof ON pp.profile_id = prof.profile_id
    JOIN users u ON prof.user_id = u.user_id
    WHERE pp.project_id = proj.project_id
  ) as participants
FROM lookbook_projects proj;

-- =====================================================
-- AUTO-UPDATE TIMESTAMP FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_lookbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_lookbook_profiles_updated_at ON lookbook_profiles;
CREATE TRIGGER update_lookbook_profiles_updated_at 
  BEFORE UPDATE ON lookbook_profiles
  FOR EACH ROW EXECUTE FUNCTION update_lookbook_updated_at();

DROP TRIGGER IF EXISTS update_lookbook_projects_updated_at ON lookbook_projects;
CREATE TRIGGER update_lookbook_projects_updated_at 
  BEFORE UPDATE ON lookbook_projects
  FOR EACH ROW EXECUTE FUNCTION update_lookbook_updated_at();

-- Success message
SELECT '✓ Lookbook schema loaded (compatible with segundo-db)!' as status;


