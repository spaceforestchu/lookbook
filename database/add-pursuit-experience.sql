-- Add Pursuit AI-Native Program experience to all 34 profiles

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  id as profile_id,
  'Pursuit' as org,
  'AI-Native Program' as role,
  '2025-03-01' as date_from,
  NULL as date_to,  -- NULL represents "Present"
  'Participant in Pursuit''s AI-Native Fellowship, building cutting-edge applications using AI tools and modern development practices.' as summary,
  1 as display_order
FROM lookbook_profiles
WHERE NOT EXISTS (
  SELECT 1 FROM lookbook_experience e 
  WHERE e.profile_id = lookbook_profiles.id 
  AND e.org = 'Pursuit' 
  AND e.role = 'AI-Native Program'
);

-- Verify the additions
SELECT COUNT(*) as experiences_added FROM lookbook_experience WHERE org = 'Pursuit' AND role = 'AI-Native Program';

