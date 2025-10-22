-- Remove 4 more profiles from Lookbook (Batch 2)
-- These users will remain in the users table but won't have Lookbook profiles

DELETE FROM lookbook_profiles WHERE slug IN (
  'gabo-arora',         -- 13. Gabo Arora
  'karoline-xiong',     -- 20. Karoline Xiong
  'robert-bailey',      -- 33. Robert Bailey
  'roby-sekhar'         -- 35. Roby Sekhar
);

-- Verify the deletion
SELECT COUNT(*) as remaining_profiles FROM lookbook_profiles;

