-- First, remove existing experience for bob-wilson profile
DELETE FROM lookbook_experience 
WHERE profile_id = (SELECT profile_id FROM lookbook_profiles WHERE slug = 'bob-wilson');

-- Add Pursuit experience
INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.profile_id,
  'Pursuit',
  'AI Native Program',
  '2025',
  NULL,
  'Pursuing full-stack development with focus on AI-powered applications',
  0
FROM lookbook_profiles p WHERE p.slug = 'bob-wilson';

-- Add Daily Bugle experience
INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.profile_id,
  'Daily Bugle',
  'Freelance Photographer',
  '2021',
  '2024',
  'Freelance photography while teaching full-stack web development',
  1
FROM lookbook_profiles p WHERE p.slug = 'bob-wilson';
