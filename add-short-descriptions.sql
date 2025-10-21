-- Add short descriptions to all projects

UPDATE lookbook_projects 
SET short_description = 'A real-time safety dashboard using AI vision to detect unusual activity on public cameras.'
WHERE project_id = 4; -- Neighborhood Watch

UPDATE lookbook_projects 
SET short_description = 'Wearable prototype that monitors motion patterns and environmental data to predict potential hazards.'
WHERE project_id = 5; -- SpideySense

UPDATE lookbook_projects 
SET short_description = 'Automated image-tagging tool for journalists using CNN-based object detection.'
WHERE project_id = 6; -- Bugle Vision

UPDATE lookbook_projects 
SET short_description = 'Modern financial platform with real-time transactions and advanced analytics.'
WHERE project_id = 1; -- FinTech Platform

UPDATE lookbook_projects 
SET short_description = 'Intelligent health tracking with ML-powered insights and personalized recommendations.'
WHERE project_id = 2; -- AI Health Tracker

UPDATE lookbook_projects 
SET short_description = 'Full-featured e-commerce platform with product management and payment processing.'
WHERE project_id = 3; -- E-Commerce Marketplace

