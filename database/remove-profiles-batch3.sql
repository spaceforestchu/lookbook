-- Remove 1 more profile from Lookbook (Batch 3)
-- This user will remain in the users table but won't have a Lookbook profile

DELETE FROM lookbook_profiles WHERE slug IN (
  'kirstie-chen'        -- 20. Kirstie Chen
);

-- Verify the deletion
SELECT COUNT(*) as remaining_profiles FROM lookbook_profiles;

