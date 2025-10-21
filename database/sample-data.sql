-- =====================================================
-- SAMPLE DATA FOR LOOKBOOK
-- Use this to populate your database for testing
-- =====================================================

-- =====================================================
-- SAMPLE USERS (only if testing standalone)
-- Comment out if you're connecting to existing users table
-- =====================================================

INSERT INTO users (name, email) VALUES 
  ('Jane Doe', 'jane.doe@example.com'),
  ('John Smith', 'john.smith@example.com'),
  ('Alice Johnson', 'alice.johnson@example.com'),
  ('Bob Wilson', 'bob.wilson@example.com'),
  ('Carol Martinez', 'carol.martinez@example.com')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SAMPLE PROFILES
-- =====================================================

INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, industry_expertise, open_to_work, highlights, photo_url, linkedin_url, github_url)
VALUES 
  (
    (SELECT id FROM users WHERE email = 'jane.doe@example.com'),
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
  ),
  (
    (SELECT id FROM users WHERE email = 'john.smith@example.com'),
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
    'https://linkedin.com/in/johnsmith',
    NULL
  ),
  (
    (SELECT id FROM users WHERE email = 'alice.johnson@example.com'),
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
  ),
  (
    (SELECT id FROM users WHERE email = 'bob.wilson@example.com'),
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
  ),
  (
    (SELECT id FROM users WHERE email = 'carol.martinez@example.com'),
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
    'https://linkedin.com/in/carolmartinez',
    NULL
  )
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- SAMPLE EXPERIENCE
-- =====================================================

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.id,
  'TechCorp Inc.',
  'Senior Full Stack Developer',
  '2021',
  'Present',
  'Leading development of enterprise SaaS platform. Built microservices architecture, mentored junior developers, and improved code quality through comprehensive testing.',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.id,
  'StartupXYZ',
  'Full Stack Developer',
  '2018',
  '2021',
  'Developed customer-facing web applications using React and Node.js. Implemented real-time features, payment integrations, and automated testing.',
  1
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, summary, display_order)
SELECT 
  p.id,
  'DesignStudio',
  'Lead UX Designer',
  '2020',
  'Present',
  'Leading UX design for multiple client projects. Established design system and best practices across the organization.',
  0
FROM lookbook_profiles p WHERE p.slug = 'john-smith';

-- =====================================================
-- SAMPLE PROJECTS
-- =====================================================

INSERT INTO lookbook_projects (slug, title, summary, description, skills, sectors, github_url, live_url, cohort, status)
VALUES 
  (
    'fintech-platform',
    'FinTech Platform',
    'Revolutionary financial technology platform enabling seamless transactions and investment management',
    'Built a comprehensive FinTech platform from the ground up, featuring real-time trading, portfolio management, and advanced analytics. The platform handles thousands of transactions per second with 99.99% uptime.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    ARRAY['Finance', 'Technology', 'FinTech'],
    'https://github.com/example/fintech-platform',
    'https://fintech-demo.example.com',
    '2024',
    'active'
  ),
  (
    'health-tracker',
    'AI Health Tracker',
    'Intelligent health tracking application using machine learning for personalized insights',
    'Developed an AI-powered health tracking application that provides personalized health recommendations based on user data. Features include activity tracking, meal logging, and predictive analytics.',
    ARRAY['Python', 'TensorFlow', 'React Native', 'MongoDB', 'Flask'],
    ARRAY['Healthcare', 'AI', 'Mobile'],
    'https://github.com/example/health-tracker',
    NULL,
    '2024',
    'active'
  ),
  (
    'ecommerce-marketplace',
    'E-Commerce Marketplace',
    'Modern e-commerce platform connecting buyers and sellers worldwide',
    'Built a full-featured e-commerce marketplace with product listings, shopping cart, payment processing, and order management. Supports multiple vendors and includes admin dashboard.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
    ARRAY['E-commerce', 'Technology', 'Retail'],
    'https://github.com/example/ecommerce',
    'https://marketplace-demo.example.com',
    '2023',
    'active'
  ),
  (
    'cloud-dashboard',
    'Cloud Infrastructure Dashboard',
    'Real-time monitoring and management dashboard for cloud infrastructure',
    'Created a comprehensive dashboard for monitoring and managing cloud infrastructure across multiple providers. Features real-time metrics, cost analysis, and automated scaling.',
    ARRAY['React', 'TypeScript', 'Kubernetes', 'Grafana', 'Prometheus'],
    ARRAY['Technology', 'Cloud Infrastructure', 'DevOps'],
    'https://github.com/example/cloud-dashboard',
    NULL,
    '2023',
    'active'
  ),
  (
    'social-analytics',
    'Social Media Analytics Tool',
    'Advanced analytics platform for social media performance tracking',
    'Developed a comprehensive social media analytics platform that aggregates data from multiple platforms and provides actionable insights through beautiful visualizations and reports.',
    ARRAY['Python', 'React', 'PostgreSQL', 'D3.js', 'AWS'],
    ARRAY['Technology', 'Marketing', 'Analytics'],
    'https://github.com/example/social-analytics',
    'https://social-analytics-demo.example.com',
    '2024',
    'active'
  );

-- =====================================================
-- LINK PARTICIPANTS TO PROJECTS
-- =====================================================

-- FinTech Platform
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.id,
  'Lead Developer',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.id,
  'UX Designer',
  1
FROM lookbook_profiles p WHERE p.slug = 'john-smith';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'fintech-platform'),
  p.id,
  'Product Manager',
  2
FROM lookbook_profiles p WHERE p.slug = 'carol-martinez';

-- AI Health Tracker
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'health-tracker'),
  p.id,
  'Data Scientist & ML Engineer',
  0
FROM lookbook_profiles p WHERE p.slug = 'alice-johnson';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'health-tracker'),
  p.id,
  'Mobile Developer',
  1
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

-- E-Commerce Marketplace
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'ecommerce-marketplace'),
  p.id,
  'Full Stack Developer',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'ecommerce-marketplace'),
  p.id,
  'UX Designer',
  1
FROM lookbook_profiles p WHERE p.slug = 'john-smith';

-- Cloud Dashboard
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'cloud-dashboard'),
  p.id,
  'DevOps Engineer & Lead',
  0
FROM lookbook_profiles p WHERE p.slug = 'bob-wilson';

-- Social Analytics
INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'social-analytics'),
  p.id,
  'Backend Developer',
  0
FROM lookbook_profiles p WHERE p.slug = 'jane-doe';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'social-analytics'),
  p.id,
  'Data Scientist',
  1
FROM lookbook_profiles p WHERE p.slug = 'alice-johnson';

INSERT INTO lookbook_project_participants (project_id, profile_id, role, display_order)
SELECT 
  (SELECT id FROM lookbook_projects WHERE slug = 'social-analytics'),
  p.id,
  'Product Manager',
  2
FROM lookbook_profiles p WHERE p.slug = 'carol-martinez';

-- =====================================================
-- VERIFY DATA
-- =====================================================

-- Check profiles
SELECT 
  u.name,
  p.slug,
  p.title,
  p.open_to_work,
  array_length(p.skills, 1) as skill_count
FROM lookbook_profiles p
JOIN users u ON p.user_id = u.id
ORDER BY u.name;

-- Check projects with participant count
SELECT 
  p.title,
  p.cohort,
  array_length(p.skills, 1) as tech_count,
  COUNT(pp.id) as team_size
FROM lookbook_projects p
LEFT JOIN lookbook_project_participants pp ON p.id = pp.project_id
GROUP BY p.id, p.title, p.cohort
ORDER BY p.title;

-- Success message
SELECT '✓ Sample data loaded successfully!' as status;


