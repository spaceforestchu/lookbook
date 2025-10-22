-- Update all Pursuit experience date_from to display as "March 2025"

UPDATE lookbook_experience
SET date_from = 'March 2025'
WHERE org = 'Pursuit' 
  AND role = 'AI-Native Program'
  AND date_from = '2025-03-01';

-- Verify the update
SELECT COUNT(*) as experiences_updated FROM lookbook_experience 
WHERE org = 'Pursuit' AND role = 'AI-Native Program' AND date_from = 'March 2025';

