-- Update Neighborhood Watch with video descriptions that appear between videos
-- Storing as JSON array with url and description for each video

UPDATE lookbook_projects 
SET demo_video_url = '[
  {
    "url": "https://player.vimeo.com/video/1120735582",
    "description": "This demo showcases the real-time safety dashboard interface, demonstrating how the AI vision system detects and alerts users to unusual activity patterns captured by public cameras."
  },
  {
    "url": "https://player.vimeo.com/video/1113169877",
    "description": "In this second demo, we dive deeper into the alert management system and historical data analysis features. See how administrators can review past incidents and adjust sensitivity settings."
  }
]'
WHERE project_id = 4;

