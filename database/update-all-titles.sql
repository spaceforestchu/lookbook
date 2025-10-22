-- Update all profile titles to 'AI-Native Builder'

UPDATE lookbook_profiles
SET title = 'AI-Native Builder'
WHERE title IS DISTINCT FROM 'AI-Native Builder';

-- Verify the update
SELECT COUNT(*) as profiles_updated FROM lookbook_profiles WHERE title = 'AI-Native Builder';

