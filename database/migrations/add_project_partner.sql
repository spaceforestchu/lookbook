-- Add project partner fields to lookbook_projects table

ALTER TABLE lookbook_projects 
ADD COLUMN IF NOT EXISTS has_partner BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS partner_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_logo_url TEXT;

COMMENT ON COLUMN lookbook_projects.has_partner IS 'Whether this project has a partner organization';
COMMENT ON COLUMN lookbook_projects.partner_name IS 'Name of the partner organization';
COMMENT ON COLUMN lookbook_projects.partner_logo_url IS 'URL of the partner organization logo';

