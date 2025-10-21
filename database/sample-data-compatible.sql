-- =====================================================
-- SAMPLE DATA - COMPATIBLE WITH SEGUNDO-DB STRUCTURE
-- =====================================================

-- =====================================================
-- SAMPLE USERS (for local testing only)
-- Skip this section when running on production database
-- =====================================================

INSERT INTO users (first_name, last_name, email, role, cohort, active) VALUES 
  ('Jane', 'Doe', 'jane.doe@example.com', 'builder', 'March 2025', true),
  ('John', 'Smith', 'john.smith@example.com', 'builder', 'March 2025', true),
  ('Alice', 'Johnson', 'alice.johnson@example.com', 'builder', 'December 2024', true),
  ('Bob', 'Wilson', 'bob.wilson@example.com', 'builder', 'December 2024', true),
  ('Carol', 'Martinez', 'carol.martinez@example.com', 'builder', 'March 2025', true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- LOOKBOOK PROFILES
-- =====================================================

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url, github_url)
SELECT
  u.user_id,
  'jane-doe',
  'Full Stack Developer',
  'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and PostgreSQL.',
  ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
  ARRAY['Technology', 'FinTech', 'E-commerce'],
  true,
  ARRAY[
    'Built microservices architecture serving 1M+ users',
    'Led team of 4 developers on major product launch',
    'Reduced API response time by 60% through optimization'
  ],
  'https://via.placeholder.com/400x400/4299e1/ffffff?text=JD',
  'https://linkedin.com/in/janedoe',
  'https://github.com/janedoe'
FROM users u WHERE u.email = 'jane.doe@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url)
SELECT
  u.user_id,
  'john-smith',
  'UX Designer',
  'Creative UX designer focused on creating beautiful, intuitive user experiences. Expert in user research, prototyping, and design systems.',
  ARRAY['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
  ARRAY['Technology', 'Healthcare', 'Education'],
  false,
  ARRAY[
    'Redesigned flagship product increasing user engagement by 40%',
    'Established design system used across 10+ products',
    'Conducted 100+ user interviews and usability tests'
  ],
  'https://via.placeholder.com/400x400/805ad5/ffffff?text=JS',
  'https://linkedin.com/in/johnsmith'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url, github_url)
SELECT
  u.user_id,
  'alice-johnson',
  'Data Scientist',
  'Data scientist with expertise in machine learning, statistical analysis, and data visualization. Passionate about turning data into actionable insights.',
  ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization', 'Statistics'],
  ARRAY['Technology', 'Healthcare', 'AI'],
  true,
  ARRAY[
    'Developed ML model improving prediction accuracy by 35%',
    'Published 3 papers on applied machine learning',
    'Built real-time analytics dashboard processing 1TB+ data'
  ],
  'https://via.placeholder.com/400x400/38b2ac/ffffff?text=AJ',
  'https://linkedin.com/in/alicejohnson',
  'https://github.com/alicejohnson'
FROM users u WHERE u.email = 'alice.johnson@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url, github_url)
SELECT
  u.user_id,
  'bob-wilson',
  'DevOps Engineer',
  'DevOps engineer specializing in cloud infrastructure, CI/CD, and container orchestration. Love automating everything!',
  ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
  ARRAY['Technology', 'Cloud Infrastructure'],
  false,
  ARRAY[
    'Reduced deployment time from hours to minutes',
    'Managed infrastructure for 50+ microservices',
    'Achieved 99.99% uptime for critical services'
  ],
  'https://via.placeholder.com/400x400/f6ad55/ffffff?text=BW',
  'https://linkedin.com/in/bobwilson',
  'https://github.com/bobwilson'
FROM users u WHERE u.email = 'bob.wilson@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url)
SELECT
  u.user_id,
  'carol-martinez',
  'Product Manager',
  'Strategic product manager with a track record of launching successful products. Expert in agile methodologies and data-driven decision making.',
  ARRAY['Product Management', 'Agile', 'User Stories', 'Analytics', 'Roadmapping'],
  ARRAY['Technology', 'FinTech', 'SaaS'],
  true,
  ARRAY[
    'Launched 3 products generating $5M+ ARR',
    'Grew user base from 10K to 100K in 12 months',
    'Managed product portfolio worth $20M'
  ],
  'https://via.placeholder.com/400x400/ed64a6/ffffff?text=CM',
  'https://linkedin.com/in/carolmartinez'
FROM users u WHERE u.email = 'carol.martinez@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- SAMPLE EXPERIENCE
-- =====================================================

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.profile_id,
  'TechCorp Inc.',
  'Senior Full Stack Developer',
  '2021',
  'Present',
  'Leading development of enterprise SaaS platform. Built microservices architecture, mentored junior developers, and improved code quality through comprehensive testing.',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.profile_id,
  'StartupXYZ',
  'Full Stack Developer',
  '2018',
  '2021',
  'Developed customer-facing web applications using React and Node.js. Implemented real-time features, payment integrations, and automated testing.',
  1
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

-- =====================================================
-- SAMPLE PROJECTS
-- =====================================================

INSERT INTO lookbook_projects (slug, title, summary, description, skills, sectors, github_url, live_url, cohort, status)
VALUES 
  (
    'fintech-platform',
    'FinTech Platform',
    'Revolutionary financial technology platform enabling seamless transactions and investment management',
    'Built a comprehensive FinTech platform from the ground up, featuring real-time trading, portfolio management, and advanced analytics.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    ARRAY['Finance', 'Technology', 'FinTech'],
    'https://github.com/example/fintech-platform',
    'https://fintech-demo.example.com',
    'March 2025',
    'active'
  ),
  (
    'health-tracker',
    'AI Health Tracker',
    'Intelligent health tracking application using machine learning for personalized insights',
    'Developed an AI-powered health tracking application that provides personalized health recommendations based on user data.',
    ARRAY['Python', 'TensorFlow', 'React Native', 'MongoDB', 'Flask'],
    ARRAY['Healthcare', 'AI', 'Mobile'],
    'https://github.com/example/health-tracker',
    NULL,
    'December 2024',
    'active'
  ),
  (
    'ecommerce-marketplace',
    'E-Commerce Marketplace',
    'Modern e-commerce platform connecting buyers and sellers worldwide',
    'Built a full-featured e-commerce marketplace with product listings, shopping cart, payment processing, and order management.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
    ARRAY['E-commerce', 'Technology', 'Retail'],
    'https://github.com/example/ecommerce',
    'https://marketplace-demo.example.com',
    'December 2024',
    'active'
  );

-- =====================================================
-- LINK PARTICIPANTS TO PROJECTS
-- =====================================================

-- FinTech Platform team
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.profile_id,
  'Lead Developer',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.profile_id,
  'UX Designer',
  1
FROM lookbook_profiles p WHERE p.slug = 'john-smith';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.profile_id,
  'Product Manager',
  2
FROM lookbook_profiles p WHERE p.slug = 'carol-martinez';

-- AI Health Tracker team
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'health-tracker'),
  p.profile_id,
  'Data Scientist & ML Engineer',
  0
FROM lookbook_profiles p WHERE p.slug = 'alice-johnson';

-- E-Commerce Marketplace team
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'ecommerce-marketplace'),
  p.profile_id,
  'Full Stack Developer',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT project_id FROM lookbook_projects WHERE slug = 'ecommerce-marketplace'),
  p.profile_id,
  'DevOps Engineer',
  1
FROM lookbook_profiles p WHERE p.slug = 'bob-wilson';

-- =====================================================
-- VERIFY DATA
-- =====================================================

SELECT 
  u.first_name || ' ' || u.last_name as name,
  p.slug,
  p.title,
  p.open_to_work,
  array_length(p.skills, 1) as skill_count
FROM lookbook_profiles p
JOIN users u ON p.user_id = u.user_id
ORDER BY u.first_name;

SELECT 
  proj.title,
  proj.cohort,
  array_length(proj.skills, 1) as tech_count,
  COUNT(pp.id) as team_size
FROM lookbook_projects proj
LEFT JOIN lookbook_project_participants pp ON proj.project_id = pp.project_id
GROUP BY proj.project_id, proj.title, proj.cohort
ORDER BY proj.title;

SELECT '✓ Sample data loaded successfully!' as status;


