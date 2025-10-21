-- Update all profile photos with cartoon-style avatars
-- Using fun, diverse cartoon styles

-- Jane Doe - Full Stack Developer (profile_id: 1)
UPDATE lookbook_profiles 
SET photo_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane&backgroundColor=ffd5dc'
WHERE profile_id = 1;

-- John Smith - UX Designer (profile_id: 2)
UPDATE lookbook_profiles 
SET photo_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed=John&backgroundColor=c5d8ff'
WHERE profile_id = 2;

-- Alice Johnson - Data Scientist (profile_id: 3)
UPDATE lookbook_profiles 
SET photo_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice&backgroundColor=ffecc7'
WHERE profile_id = 3;

-- Peter Parker - Pursuit AI Native Program (profile_id: 4)
UPDATE lookbook_profiles 
SET photo_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Peter&backgroundColor=d5f5e3'
WHERE profile_id = 4;

-- Carol Martinez - Product Manager (profile_id: 5)
UPDATE lookbook_profiles 
SET photo_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Carol&backgroundColor=e8daef'
WHERE profile_id = 5;
