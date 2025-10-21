-- Add 5 more dummy users and their profiles to test the homepage animation

-- First, create users
INSERT INTO users (first_name, last_name, email, role, cohort, created_at)
VALUES
  ('Sarah', 'Chen', 'sarah.chen@example.com', 'builder', '2024', NOW()),
  ('Marcus', 'Williams', 'marcus.williams@example.com', 'builder', '2024', NOW()),
  ('Lisa', 'Rodriguez', 'lisa.rodriguez@example.com', 'builder', '2023', NOW()),
  ('David', 'Kim', 'david.kim@example.com', 'builder', '2023', NOW()),
  ('Emily', 'Taylor', 'emily.taylor@example.com', 'builder', '2024', NOW())
ON CONFLICT (email) DO NOTHING;

-- Then create their profiles
INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, created_at)
SELECT 
  u.user_id,
  'sarah-chen',
  'Full-Stack Developer',
  'Experienced full-stack developer specializing in React and Node.js. Passionate about building scalable web applications.',
  ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
  ARRAY['Technology', 'E-Commerce'],
  NOW()
FROM users u WHERE u.email = 'sarah.chen@example.com'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, created_at)
SELECT 
  u.user_id,
  'marcus-williams',
  'Data Analyst',
  'Data analyst with expertise in Python and SQL. Experienced in turning complex data into actionable insights.',
  ARRAY['Python', 'SQL', 'Tableau', 'Excel', 'R'],
  ARRAY['Finance', 'Healthcare'],
  NOW()
FROM users u WHERE u.email = 'marcus.williams@example.com'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, created_at)
SELECT 
  u.user_id,
  'lisa-rodriguez',
  'Product Designer',
  'Creative product designer focused on user-centered design. Expert in creating intuitive interfaces.',
  ARRAY['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
  ARRAY['Technology', 'Consumer'],
  NOW()
FROM users u WHERE u.email = 'lisa.rodriguez@example.com'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, created_at)
SELECT 
  u.user_id,
  'david-kim',
  'DevOps Engineer',
  'DevOps engineer passionate about automation and infrastructure as code. Experienced in CI/CD pipelines.',
  ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
  ARRAY['Technology', 'Fintech'],
  NOW()
FROM users u WHERE u.email = 'david.kim@example.com'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, created_at)
SELECT 
  u.user_id,
  'emily-taylor',
  'Marketing Manager',
  'Strategic marketing manager with a track record of successful digital campaigns and data-driven decisions.',
  ARRAY['SEO', 'Content Strategy', 'Google Analytics', 'Social Media'],
  ARRAY['Consumer', 'Media'],
  NOW()
FROM users u WHERE u.email = 'emily.taylor@example.com'
ON CONFLICT (slug) DO NOTHING;

-- Display the newly added profiles
SELECT u.first_name || ' ' || u.last_name as name, p.slug, p.title 
FROM lookbook_profiles p
JOIN users u ON p.user_id = u.user_id
WHERE p.slug IN ('sarah-chen', 'marcus-williams', 'lisa-rodriguez', 'david-kim', 'emily-taylor');
