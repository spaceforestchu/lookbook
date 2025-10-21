-- Update project sectors to match standardized industry list
-- Standardized list: B2B, Fintech, Consumer, Education, Healthcare, Real Estate and Construction, Industrials, Government

-- FinTech Platform - Fintech
UPDATE lookbook_projects SET sectors = ARRAY['Fintech'] WHERE slug = 'fintech-platform';

-- AI Health Tracker - Healthcare
UPDATE lookbook_projects SET sectors = ARRAY['Healthcare'] WHERE slug = 'health-tracker';

-- E-Commerce Marketplace - Consumer
UPDATE lookbook_projects SET sectors = ARRAY['Consumer'] WHERE slug = 'ecommerce-marketplace';

-- Neighborhood Watch - Government (Public Safety)
UPDATE lookbook_projects SET sectors = ARRAY['Government'] WHERE slug = 'neighborhood-watch';

-- SpideySense - Industrials (Safety/Wearables)
UPDATE lookbook_projects SET sectors = ARRAY['Industrials'] WHERE slug = 'spideysense';

-- Bugle Vision - B2B (Media Intelligence)
UPDATE lookbook_projects SET sectors = ARRAY['B2B'] WHERE slug = 'bugle-vision';

-- TaskMaster - B2B (Productivity)
UPDATE lookbook_projects SET sectors = ARRAY['B2B'] WHERE slug = 'taskmaster';

-- FoodieConnect - Consumer (Food)
UPDATE lookbook_projects SET sectors = ARRAY['Consumer'] WHERE slug = 'foodie-connect';

-- GreenThumb - Consumer (Lifestyle)
UPDATE lookbook_projects SET sectors = ARRAY['Consumer'] WHERE slug = 'greenthumb';

-- CodeMentor - Education
UPDATE lookbook_projects SET sectors = ARRAY['Education'] WHERE slug = 'codementor';

