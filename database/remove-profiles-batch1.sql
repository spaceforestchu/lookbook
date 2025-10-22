-- Remove 21 profiles from Lookbook (Batch 1)
-- These users will remain in the users table but won't have Lookbook profiles

DELETE FROM lookbook_profiles WHERE slug IN (
  'alexis-medina',      -- 1. Alexis Medina
  'alisa-daniley',      -- 2. Alisa Daniley
  'ari-bilici',         -- 3. Ari Bilici
  'becky-lee',          -- 7. Becky Lee
  'cameron-bridgwater', -- 9. Cameron Bridgwater
  'carlos-godoy',       -- 10. Carlos Godoy
  'david-yang',         -- 13. David Yang
  'donald-grier',       -- 14. Donald Grier
  'jacqueline-reverand',-- 24. Jacqueline Reverand
  'joanna-patterson',   -- 27. Joanna Patterson
  'john-gomez',         -- 28. John Gomez
  'jukay-hsu',          -- 30. Jukay Hsu
  'lanice-powell',      -- 35. LaNice Powell
  'luna-aizarani',      -- 37. Luna Aizarani
  'pak-chu',            -- 41. Pak Chu
  'paul-gasbarra',      -- 42. Paul Gasbarra
  'rod-monje',          -- 52. Rod Monje
  'stefano-barros',     -- 56. Stefano Barros
  'steve-lohr',         -- 57. Steve Lohr
  'test-user',          -- 58. Test User
  'yoshiyuki-minami'    -- 60. Yoshiyuki Minami
);

-- Verify the deletion
SELECT COUNT(*) as remaining_profiles FROM lookbook_profiles;

