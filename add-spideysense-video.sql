-- Add a demo video and description to SpideySense project

UPDATE lookbook_projects
SET demo_video_url = JSONB_BUILD_ARRAY(
  JSONB_BUILD_OBJECT(
    'url', 'https://player.vimeo.com/video/1084781131',
    'description', 'This demonstration video showcases SpideySense in action during a controlled hazard simulation environment. Watch as the wearable device successfully predicts and alerts the user to various danger scenarios including falling objects, unstable surfaces, and approaching hazards. The video highlights the real-time processing capabilities of the neural network, the intuitive haptic feedback system, and the mobile app interface that provides detailed incident reports and risk analytics. You''ll see how the multiple sensor arrays work in concert to provide comprehensive environmental awareness and split-second warning times that can make the difference in critical safety situations.'
  )
)::text
WHERE project_id = 5;

