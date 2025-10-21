-- Update SpideySense to show first screenshot, then video with text, then second screenshot after the text

-- First, let's structure it so:
-- Screenshot 1 comes first
-- Then video (with description appearing after it)
-- Then screenshot 2 appears after the text

UPDATE lookbook_projects
SET main_image_url = 'https://picsum.photos/seed/spidey/1400/900',
    demo_video_url = JSONB_BUILD_ARRAY(
      JSONB_BUILD_OBJECT(
        'url', 'https://player.vimeo.com/video/1084781131',
        'description', 'This demonstration video showcases SpideySense in action during a controlled hazard simulation environment. Watch as the wearable device successfully predicts and alerts the user to various danger scenarios including falling objects, unstable surfaces, and approaching hazards. The video highlights the real-time processing capabilities of the neural network, the intuitive haptic feedback system, and the mobile app interface that provides detailed incident reports and risk analytics. You''ll see how the multiple sensor arrays work in concert to provide comprehensive environmental awareness and split-second warning times that can make the difference in critical safety situations.',
        'screenshot_after', 'https://picsum.photos/seed/spidey-sensor/1400/900'
      )
    )::text
WHERE project_id = 5;

