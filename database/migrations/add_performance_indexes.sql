-- Add indexes for performance optimization
-- These indexes speed up common query patterns

-- Index on profile slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON lookbook_profiles(slug);

-- Index on project slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON lookbook_projects(slug);

-- Index on user_id for profile joins
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON lookbook_profiles(user_id);

-- Index on project_id for participant joins
CREATE INDEX IF NOT EXISTS idx_project_participants_project_id ON lookbook_project_participants(project_id);

-- Index on profile_id for participant joins
CREATE INDEX IF NOT EXISTS idx_project_participants_profile_id ON lookbook_project_participants(profile_id);

-- GIN indexes for array columns (skills, sectors) for fast filtering
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON lookbook_profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_projects_skills ON lookbook_projects USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_projects_sectors ON lookbook_projects USING GIN (sectors);

-- Index on featured for fast filtering of featured profiles
CREATE INDEX IF NOT EXISTS idx_profiles_featured ON lookbook_profiles(featured) WHERE featured = true;

-- Index on has_partner for projects with partners
CREATE INDEX IF NOT EXISTS idx_projects_has_partner ON lookbook_projects(has_partner) WHERE has_partner = true;

COMMENT ON INDEX idx_profiles_slug IS 'Fast profile lookups by slug';
COMMENT ON INDEX idx_projects_slug IS 'Fast project lookups by slug';
COMMENT ON INDEX idx_profiles_skills IS 'Fast filtering by skills using GIN index';
COMMENT ON INDEX idx_projects_skills IS 'Fast filtering by skills using GIN index';
COMMENT ON INDEX idx_projects_sectors IS 'Fast filtering by sectors using GIN index';

