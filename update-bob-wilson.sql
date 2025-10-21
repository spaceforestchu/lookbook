-- Update Bob Wilson's profile to match the mockup
UPDATE lookbook_profiles
SET 
  bio = 'Born and raised in Queens, New York, Peter Parker has always been fascinated by how things work — from building small gadgets in his bedroom to photographing the city skyline. While studying biophysics at Empire State University, a lab accident sparked his curiosity for the intersection of biology, data, and technology.

After college, Peter began working as a freelance photographer while teaching himself full-stack web development. His analytical background and problem-solving mindset eventually led him into software engineering, where he''s focused on building AI-powered tools that help people make sense of complex systems — from traffic analytics to urban safety networks. A lifelong New Yorker and community volunteer, Peter is passionate about using technology for social good, mentorship, and making sure the next generation of innovators has access to the same opportunities that changed his own life.',
  title = 'Pursuit AI Native Program 2025',
  skills = ARRAY['Cursor', 'Windsurf', 'JavaScript', 'Ruby', 'SQL', 'MongoDB', 'Amazon DynamoDB', 'PostgreSQL', 'React', 'Node.js', 'Express', 'Next.js'],
  industry_expertise = ARRAY['AI', 'MEDIA', 'CONSUMER'],
  highlights = ARRAY[
    'Webslinger',
    'Background in biophysics and applied machine learning'
  ]
WHERE slug = 'bob-wilson';
