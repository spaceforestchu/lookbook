-- Add 4 more projects with dummy data

-- Project 7: TaskMaster
INSERT INTO lookbook_projects (
  slug, 
  title, 
  summary, 
  short_description,
  skills, 
  sectors, 
  main_image_url,
  github_url,
  live_url,
  cohort, 
  status
) VALUES (
  'taskmaster',
  'TaskMaster',
  'TaskMaster is a comprehensive project management and collaboration platform designed for distributed teams. Built with real-time synchronization in mind, it enables seamless coordination across time zones with instant updates, threaded discussions, and intelligent notification systems. The platform features advanced task dependencies, automated workflow triggers, and customizable dashboards that provide at-a-glance visibility into project health and team productivity. Integration with popular development tools and APIs allows teams to centralize their work without disrupting existing workflows.',
  'A comprehensive project management platform with real-time collaboration features and workflow automation.',
  ARRAY['Vue.js', 'Node.js', 'MongoDB', 'Socket.io', 'Redis'],
  ARRAY['PRODUCTIVITY'],
  'https://picsum.photos/seed/taskmaster/1400/900',
  'https://github.com/example/taskmaster',
  'https://taskmaster-demo.example.com',
  '2023',
  'active'
);

-- Project 8: FoodieConnect
INSERT INTO lookbook_projects (
  slug, 
  title, 
  summary, 
  short_description,
  skills, 
  sectors, 
  main_image_url,
  github_url,
  live_url,
  cohort, 
  status
) VALUES (
  'foodie-connect',
  'FoodieConnect',
  'FoodieConnect revolutionizes the local dining experience by connecting food enthusiasts with hidden culinary gems in their neighborhoods. Using machine learning algorithms, the app provides personalized restaurant recommendations based on taste preferences, dietary restrictions, and past dining experiences. Users can share food photos, write reviews, and join community food tours organized by local guides. The platform also includes a reservation system with real-time availability and a loyalty program that rewards frequent diners with exclusive perks.',
  'A social dining app that connects food lovers with local restaurants through AI-powered recommendations.',
  ARRAY['React Native', 'Python', 'Django', 'PostgreSQL', 'TensorFlow'],
  ARRAY['FOOD'],
  'https://picsum.photos/seed/foodie/1400/900',
  'https://github.com/example/foodie-connect',
  'https://foodie-demo.example.com',
  '2023',
  'active'
);

-- Project 9: GreenThumb
INSERT INTO lookbook_projects (
  slug, 
  title, 
  summary, 
  short_description,
  skills, 
  sectors, 
  main_image_url,
  github_url,
  live_url,
  cohort, 
  status
) VALUES (
  'greenthumb',
  'GreenThumb',
  'GreenThumb empowers urban gardeners and plant enthusiasts to cultivate thriving indoor and outdoor gardens through smart technology. The app uses computer vision to diagnose plant health issues from uploaded photos, provides personalized care schedules based on local weather conditions, and connects users with a community of gardening experts. Features include a plant identification system, watering reminders with soil moisture tracking integration, and a marketplace for exchanging seeds and plant cuttings with nearby gardeners.',
  'An intelligent gardening assistant that uses AI to help users grow and maintain healthy plants.',
  ARRAY['Swift', 'Firebase', 'Core ML', 'ARKit'],
  ARRAY['LIFESTYLE'],
  'https://picsum.photos/seed/greenthumb/1400/900',
  'https://github.com/example/greenthumb',
  'https://greenthumb-demo.example.com',
  '2024',
  'active'
);

-- Project 10: CodeMentor
INSERT INTO lookbook_projects (
  slug, 
  title, 
  summary, 
  short_description,
  skills, 
  sectors, 
  main_image_url,
  github_url,
  live_url,
  cohort, 
  status
) VALUES (
  'codementor',
  'CodeMentor',
  'CodeMentor bridges the gap between aspiring developers and experienced programmers through an intelligent peer-to-peer learning platform. The system automatically matches students with mentors based on skill level, learning goals, and scheduling availability. Interactive code playgrounds allow for real-time collaborative coding sessions with built-in video chat and screen sharing. The platform tracks learning progress, suggests personalized learning paths, and awards achievement badges to motivate continued engagement. Built-in code review tools and project showcases help students build portfolios while receiving constructive feedback from the community.',
  'A peer-to-peer learning platform connecting aspiring developers with experienced mentors.',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'WebRTC', 'Tailwind CSS'],
  ARRAY['EDUCATION'],
  'https://picsum.photos/seed/codementor/1400/900',
  'https://github.com/example/codementor',
  'https://codementor-demo.example.com',
  '2024',
  'active'
);

-- Add team members to projects
-- TaskMaster team
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES
  (7, 2, 'Frontend Developer'),
  (7, 5, 'Product Manager');

-- FoodieConnect team
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES
  (8, 1, 'Full Stack Developer'),
  (8, 3, 'Data Scientist');

-- GreenThumb team
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES
  (9, 2, 'iOS Developer'),
  (9, 4, 'ML Engineer');

-- CodeMentor team
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES
  (10, 1, 'Full Stack Developer'),
  (10, 2, 'UX Designer'),
  (10, 5, 'Product Manager');

