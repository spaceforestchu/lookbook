-- Update projects with realistic webapp screenshots
-- Using Lorem Picsum for realistic images

-- FinTech Platform (project_id: 1) - Dashboard/charts theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/fintech-dashboard/1400/900'
WHERE project_id = 1;

-- AI Health Tracker (project_id: 2) - Health/medical theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/health-app/1400/900'
WHERE project_id = 2;

-- E-Commerce Marketplace (project_id: 3) - Shopping/products theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/ecommerce-store/1400/900'
WHERE project_id = 3;

-- Neighborhood Watch (project_id: 4) - Security/monitoring theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/safety-monitor/1400/900'
WHERE project_id = 4;

-- SpideySense (project_id: 5) - Detection/tracking theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/motion-detector/1400/900'
WHERE project_id = 5;

-- Bugle Vision (project_id: 6) - Image analysis theme
UPDATE lookbook_projects 
SET main_image_url = 'https://picsum.photos/seed/image-analysis/1400/900'
WHERE project_id = 6;
