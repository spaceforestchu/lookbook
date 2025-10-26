-- Add featured column to lookbook_profiles table
-- This allows certain profiles to display with premium card effects

ALTER TABLE lookbook_profiles
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN lookbook_profiles.featured IS 'Indicates if the profile should display with premium Ultra card effects';

-- Optionally, you can set some profiles as featured for testing:
-- UPDATE lookbook_profiles SET featured = TRUE WHERE slug IN ('some-slug', 'another-slug');

