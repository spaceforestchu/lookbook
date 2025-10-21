-- Update Neighborhood Watch with expanded content
-- More detailed About section and text between videos

UPDATE lookbook_projects 
SET 
  summary = 'Neighborhood Watch is a real-time safety dashboard that leverages AI vision technology to monitor public camera feeds and detect unusual activity patterns. The system processes live video streams, identifies potential safety concerns, and generates intelligent notifications for community safety teams. By combining computer vision, machine learning, and intuitive dashboard design, Neighborhood Watch helps communities stay informed and respond quickly to incidents while respecting privacy guidelines.',
  demo_video_url = '[
    {
      "url": "https://player.vimeo.com/video/1120735582",
      "description": "This demo showcases the real-time safety dashboard interface, demonstrating how the AI vision system detects and alerts users to unusual activity patterns captured by public cameras. Watch as the system processes live feeds, highlights areas of interest, and generates intelligent notifications that help community safety teams stay informed without being overwhelmed by false alarms."
    },
    {
      "url": "https://player.vimeo.com/video/1113169877",
      "description": "In this second demo, we dive deeper into the platform''s advanced features including alert management, historical data analysis, and collaborative tools. See how administrators can review past incidents, adjust AI sensitivity settings for different locations, generate reports, and coordinate with community safety teams through the integrated communication platform."
    }
  ]'
WHERE project_id = 4;
