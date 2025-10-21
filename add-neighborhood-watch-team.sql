-- Add more team members to Neighborhood Watch project
-- Adding Jane Doe and Alice Johnson to join Peter Parker

-- First, check if Peter Parker is already there (profile_id: 4, project_id: 4)
-- Add Jane Doe (profile_id: 1)
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES (4, 1, 'Developer')
ON CONFLICT DO NOTHING;

-- Add Alice Johnson (profile_id: 3)
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES (4, 3, 'Data Scientist')
ON CONFLICT DO NOTHING;

-- Verify the team
SELECT p.name, pp.role 
FROM lookbook_project_participants pp
JOIN lookbook_profiles p ON pp.profile_id = p.profile_id
WHERE pp.project_id = 4
ORDER BY p.name;

