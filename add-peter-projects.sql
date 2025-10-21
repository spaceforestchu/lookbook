-- Add projects for Peter Parker
INSERT INTO lookbook_projects (title, slug, summary, skills, sectors, cohort) VALUES
  ('Neighborhood Watch', 'neighborhood-watch', 'A real-time safety dashboard using AI vision to detect unusual activity on public cameras.', ARRAY['AI', 'Computer Vision', 'React', 'Node.js'], ARRAY['Public Safety', 'AI'], 'March 2025'),
  ('SpideySense', 'spideysense', 'Wearable prototype that monitors motion patterns and environmental data to predict potential hazards.', ARRAY['IoT', 'Machine Learning', 'Python'], ARRAY['Safety', 'Wearables'], 'March 2025'),
  ('Bugle Vision', 'bugle-vision', 'Automated image-tagging tool for journalists using CNN-based object detection.', ARRAY['Machine Learning', 'Python', 'TensorFlow'], ARRAY['Media', 'AI'], 'December 2024')
ON CONFLICT (slug) DO NOTHING;

-- Link projects to Peter Parker
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
SELECT 
  p.project_id,
  prof.profile_id,
  'Developer'
FROM lookbook_projects p
CROSS JOIN lookbook_profiles prof
WHERE prof.slug = 'bob-wilson'
  AND p.slug IN ('neighborhood-watch', 'spideysense', 'bugle-vision')
ON CONFLICT DO NOTHING;
