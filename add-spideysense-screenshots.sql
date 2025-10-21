-- Update SpideySense to have multiple screenshots as a JSON array

UPDATE lookbook_projects
SET main_image_url = JSONB_BUILD_ARRAY(
  JSONB_BUILD_OBJECT(
    'url', 'https://picsum.photos/seed/spidey/1400/900',
    'description', ''
  ),
  JSONB_BUILD_OBJECT(
    'url', 'https://picsum.photos/seed/spidey-sensor/1400/900',
    'description', ''
  )
)::text
WHERE project_id = 5;

