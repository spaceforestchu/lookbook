-- =====================================================
-- Setup March 2025 Cohort for Lookbook
-- Creates profiles for all active March 2025 cohort members
-- =====================================================

-- First, clear any existing lookbook data
DELETE FROM lookbook_experience;
DELETE FROM lookbook_project_participants;
DELETE FROM lookbook_projects;
DELETE FROM lookbook_sharepack_events;
DELETE FROM lookbook_profiles;

-- Create profiles for March 2025 cohort members
-- This will create a basic profile for each active user in the cohort
INSERT INTO lookbook_profiles (
    user_id,
    slug,
    title,
    bio,
    skills,
    industry_expertise,
    open_to_work,
    photo_url,
    highlights
)
SELECT 
    u.user_id,
    -- Create slug from name (lowercase, replace spaces with hyphens)
    LOWER(REGEXP_REPLACE(
        CONCAT(u.first_name, '-', u.last_name),
        '[^a-zA-Z0-9-]', '', 'g'
    )),
    -- Default title
    'Software Engineer',
    -- Default bio
    CONCAT('Full-stack developer from Pursuit''s March 2025 cohort. Passionate about building impactful applications.'),
    -- Default skills (empty array for now)
    ARRAY[]::TEXT[],
    -- Default industry expertise
    ARRAY['Technology']::TEXT[],
    -- Open to work
    true,
    -- Photo URL - use GitHub avatar if available
    CASE 
        WHEN u.github_avatar_url IS NOT NULL AND u.github_avatar_url != '' 
        THEN u.github_avatar_url 
        ELSE NULL 
    END,
    -- Highlights
    ARRAY[]::TEXT[]
FROM users u
WHERE u.cohort = 'March 2025' 
  AND u.active = true
ORDER BY u.last_name, u.first_name;

-- Verify the profiles were created
SELECT 
    COUNT(*) as total_profiles_created,
    COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as profiles_with_photos
FROM lookbook_profiles;

-- Show sample of created profiles
SELECT 
    p.slug,
    u.first_name || ' ' || u.last_name as name,
    u.email,
    p.title,
    p.open_to_work,
    CASE WHEN p.photo_url IS NOT NULL THEN 'Yes' ELSE 'No' END as has_photo
FROM lookbook_profiles p
JOIN users u ON p.user_id = u.user_id
ORDER BY u.last_name, u.first_name
LIMIT 10;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 
    '✅ March 2025 Cohort Setup Complete!' as message,
    COUNT(*) as profiles_created
FROM lookbook_profiles;

