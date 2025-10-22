-- Create taxonomy tables for standardized skills and industries
-- These will be managed centrally in the admin panel

CREATE TABLE IF NOT EXISTS lookbook_skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50), -- e.g., 'Programming Language', 'Framework', 'Tool', etc.
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lookbook_industries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_skills_name ON lookbook_skills(name);
CREATE INDEX IF NOT EXISTS idx_industries_name ON lookbook_industries(name);

-- Insert initial set of common AI/tech skills
INSERT INTO lookbook_skills (name, category, display_order) VALUES
  ('Python', 'Programming Language', 1),
  ('JavaScript', 'Programming Language', 2),
  ('TypeScript', 'Programming Language', 3),
  ('Java', 'Programming Language', 4),
  ('C++', 'Programming Language', 5),
  ('Go', 'Programming Language', 6),
  ('Rust', 'Programming Language', 7),
  ('React', 'Framework', 10),
  ('Next.js', 'Framework', 11),
  ('Vue.js', 'Framework', 12),
  ('Angular', 'Framework', 13),
  ('Node.js', 'Framework', 14),
  ('Express', 'Framework', 15),
  ('Django', 'Framework', 16),
  ('Flask', 'Framework', 17),
  ('FastAPI', 'Framework', 18),
  ('TensorFlow', 'AI/ML', 20),
  ('PyTorch', 'AI/ML', 21),
  ('Machine Learning', 'AI/ML', 22),
  ('Deep Learning', 'AI/ML', 23),
  ('Natural Language Processing', 'AI/ML', 24),
  ('Computer Vision', 'AI/ML', 25),
  ('LLMs', 'AI/ML', 26),
  ('Prompt Engineering', 'AI/ML', 27),
  ('PostgreSQL', 'Database', 30),
  ('MongoDB', 'Database', 31),
  ('MySQL', 'Database', 32),
  ('Redis', 'Database', 33),
  ('AWS', 'Cloud/DevOps', 40),
  ('Azure', 'Cloud/DevOps', 41),
  ('Google Cloud', 'Cloud/DevOps', 42),
  ('Docker', 'Cloud/DevOps', 43),
  ('Kubernetes', 'Cloud/DevOps', 44),
  ('CI/CD', 'Cloud/DevOps', 45),
  ('Git', 'Tools', 50),
  ('REST APIs', 'Tools', 51),
  ('GraphQL', 'Tools', 52),
  ('Figma', 'Design', 60),
  ('UI/UX Design', 'Design', 61),
  ('Product Management', 'Business', 70),
  ('Agile', 'Business', 71),
  ('Data Analysis', 'Business', 72)
ON CONFLICT (name) DO NOTHING;

-- Insert initial set of industries
INSERT INTO lookbook_industries (name, description, display_order) VALUES
  ('Technology', 'Software, hardware, and technology services', 1),
  ('Healthcare', 'Medical services, health tech, biotech', 2),
  ('Finance', 'Financial services, fintech, banking', 3),
  ('Education', 'EdTech, online learning, training', 4),
  ('E-commerce', 'Online retail, marketplace platforms', 5),
  ('Entertainment', 'Media, gaming, streaming services', 6),
  ('Real Estate', 'PropTech, real estate services', 7),
  ('Transportation', 'Logistics, delivery, mobility', 8),
  ('Energy', 'Clean energy, utilities, sustainability', 9),
  ('Agriculture', 'AgTech, food production', 10),
  ('Manufacturing', 'Industrial automation, IoT', 11),
  ('Marketing', 'MarTech, advertising, analytics', 12),
  ('Social Impact', 'Non-profit, civic tech, social good', 13),
  ('Consumer', 'Consumer products and services', 14),
  ('Enterprise', 'B2B software and services', 15),
  ('AI/ML', 'Artificial intelligence and machine learning', 16),
  ('Cybersecurity', 'Security, privacy, compliance', 17),
  ('Gaming', 'Video games, esports', 18),
  ('Travel', 'Tourism, hospitality, travel tech', 19),
  ('Legal', 'Legal tech, compliance', 20)
ON CONFLICT (name) DO NOTHING;

-- Grant permissions to lookbook_user
GRANT ALL PRIVILEGES ON lookbook_skills TO lookbook_user;
GRANT ALL PRIVILEGES ON lookbook_industries TO lookbook_user;
GRANT USAGE, SELECT ON SEQUENCE lookbook_skills_id_seq TO lookbook_user;
GRANT USAGE, SELECT ON SEQUENCE lookbook_industries_id_seq TO lookbook_user;

