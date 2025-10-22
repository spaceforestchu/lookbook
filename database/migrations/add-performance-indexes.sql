-- =====================================================
-- Performance Optimization Migration
-- Adds missing indexes for faster people queries
-- =====================================================

-- Ensure GIN indexes exist for array searches (skills, industry)
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_skills 
  ON lookbook_profiles USING GIN(skills);

CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_industry 
  ON lookbook_profiles USING GIN(industry_expertise);

-- Composite index for common query pattern: open_to_work filtering + ordering
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_open_to_work_user 
  ON lookbook_profiles(open_to_work, user_id);

-- Index for JOIN performance (profiles + users)
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_user_id 
  ON lookbook_profiles(user_id);

-- Index for text search on users table (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_name_search 
  ON users USING GIN(to_tsvector('english', first_name || ' ' || last_name));

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_lookbook_profiles_slug 
  ON lookbook_profiles(slug);

-- Analyze tables for query planner optimization
ANALYZE lookbook_profiles;
ANALYZE users;
ANALYZE lookbook_experience;
ANALYZE lookbook_project_participants;

-- Create a materialized view for faster profile listing (optional, for very large datasets)
-- This would need to be refreshed periodically
-- CREATE MATERIALIZED VIEW IF NOT EXISTS lookbook_profiles_fast AS
-- SELECT 
--   p.id as profile_id,
--   p.slug,
--   p.title,
--   p.skills,
--   p.open_to_work,
--   p.photo_url,
--   p.photo_lqip,
--   u.first_name || ' ' || u.last_name as name
-- FROM lookbook_profiles p
-- JOIN users u ON p.user_id = u.user_id;
-- 
-- CREATE INDEX IF NOT EXISTS idx_profiles_fast_slug ON lookbook_profiles_fast(slug);
-- CREATE INDEX IF NOT EXISTS idx_profiles_fast_open_to_work ON lookbook_profiles_fast(open_to_work);

