-- Add background_color column to lookbook_projects table
-- This allows projects without images to have a custom background color

ALTER TABLE lookbook_projects 
ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#6366f1';

-- Update the comment
COMMENT ON COLUMN lookbook_projects.background_color IS 'Hex color code for background when no main_image_url is provided';

