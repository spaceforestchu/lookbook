-- Add icon_url field to projects table
ALTER TABLE lookbook_projects 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add comment
COMMENT ON COLUMN lookbook_projects.icon_url IS 'Project icon/logo URL (alternative to using main_image_url for icons)';

