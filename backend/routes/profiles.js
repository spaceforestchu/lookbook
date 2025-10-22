// Profile routes for Lookbook API
// Following test-pilot-server pattern

const express = require('express');
const router = express.Router();
const profileQueries = require('../queries/profileQueries');
const { pool } = require('../db/dbConfig');

// Simple in-memory cache for profiles (5 minute TTL)
const cache = {
  profiles: null,
  profilesTimestamp: 0,
  filters: null,
  filtersTimestamp: 0,
  TTL: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Helper to check if cache is valid
function isCacheValid(timestamp) {
  return Date.now() - timestamp < cache.TTL;
}

// =====================================================
// GET /api/profiles
// Get all profiles with optional filtering
// =====================================================

router.get('/', async (req, res) => {
  try {
    const { search, skills, openToWork, industries, limit, offset, page } = req.query;
    
    // If no filters and cache is valid, return cached data
    const hasFilters = search || skills || openToWork || industries;
    if (!hasFilters && cache.profiles && isCacheValid(cache.profilesTimestamp)) {
      // Add cache headers for browser caching
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(cache.profiles);
    }
    
    // Parse filters
    const filters = {
      search,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',')) : undefined,
      industries: industries ? (Array.isArray(industries) ? industries : industries.split(',')) : undefined,
      openToWork: openToWork === 'true' ? true : openToWork === 'false' ? false : undefined,
      limit: parseInt(limit) || 50,
      offset: page ? (parseInt(page) - 1) * (parseInt(limit) || 50) : parseInt(offset) || 0
    };
    
    const result = await profileQueries.getAllProfiles(filters);
    
    const response = {
      success: true,
      data: result.profiles,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        page: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.total / result.limit)
      }
    };
    
    // Cache the response if no filters
    if (!hasFilters) {
      cache.profiles = response;
      cache.profilesTimestamp = Date.now();
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    } else {
      // Shorter cache for filtered results
      res.set('Cache-Control', 'public, max-age=60'); // 1 minute
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch profiles',
      message: error.message 
    });
  }
});

// =====================================================
// GET /api/profiles/filters
// Get available filter options (skills, industries)
// =====================================================

router.get('/filters', async (req, res) => {
  try {
    // Check cache first
    if (cache.filters && isCacheValid(cache.filtersTimestamp)) {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(cache.filters);
    }
    
    const [skills, industries] = await Promise.all([
      profileQueries.getAllSkills(),
      profileQueries.getAllIndustries()
    ]);
    
    const response = {
      success: true,
      data: {
        skills,
        industries
      }
    };
    
    // Cache the filters
    cache.filters = response;
    cache.filtersTimestamp = Date.now();
    
    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch filter options',
      message: error.message 
    });
  }
});

// =====================================================
// GET /api/profiles/:slug
// Get single profile by slug
// =====================================================

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const profile = await profileQueries.getProfileBySlug(slug);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    // Set cache headers for individual profiles (longer cache)
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

// =====================================================
// POST /api/profiles
// Create new profile
// TODO: Add authentication middleware
// =====================================================

router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    
    // Basic validation
    if (!profileData.slug) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: slug'
      });
    }
    
    // If no userId provided, create a user first
    let userId = profileData.userId;
    if (!userId) {
      // Extract name from profile data or use slug as fallback
      const nameParts = profileData.name ? profileData.name.split(' ') : [profileData.slug, ''];
      const firstName = nameParts[0] || profileData.slug;
      const lastName = nameParts.slice(1).join(' ') || '';
      const email = profileData.email || `${profileData.slug}@pursuit.org`;
      
      // Create user in users table
      const userQuery = `
        INSERT INTO users (first_name, last_name, email, password_hash, role, cohort)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id
      `;
      const userResult = await pool.query(userQuery, [
        firstName,
        lastName,
        email,
        'placeholder_hash', // Placeholder password hash
        'builder',
        '2024'
      ]);
      userId = userResult.rows[0].user_id;
    }
    
    // Add userId to profileData
    const profileDataWithUser = {
      ...profileData,
      userId
    };
    
    const newProfile = await profileQueries.createProfile(profileDataWithUser);
    
    // Invalidate cache
    cache.profiles = null;
    cache.filters = null;
    
    res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle duplicate slug error
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Profile with this slug already exists'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create profile',
      message: error.message 
    });
  }
});

// =====================================================
// PUT /api/profiles/:slug
// Update profile
// TODO: Add authentication middleware
// =====================================================

router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;
    
    // Separate experience from other updates
    const { experience, ...profileUpdates } = updates;
    
    // Update the profile
    const updatedProfile = await profileQueries.updateProfile(slug, profileUpdates);
    
    if (!updatedProfile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    // If experience data is provided, update it
    if (experience && Array.isArray(experience)) {
      // First, delete all existing experience for this profile
      await pool.query('DELETE FROM lookbook_experience WHERE profile_id = $1', [updatedProfile.id]);
      
      // Then insert all experience entries
      for (let i = 0; i < experience.length; i++) {
        const exp = experience[i];
        await pool.query(`
          INSERT INTO lookbook_experience (profile_id, org, role, date_from, date_to, display_order)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          updatedProfile.id,
          exp.org || '',
          exp.role || '',
          exp.dateFrom || exp.date_from || '',
          exp.dateTo || exp.date_to || '',
          i
        ]);
      }
    }
    
    // Invalidate cache
    cache.profiles = null;
    
    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

// =====================================================
// DELETE /api/profiles/:slug
// Delete profile
// TODO: Add authentication middleware
// =====================================================

router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedProfile = await profileQueries.deleteProfile(slug);
    
    if (!deletedProfile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    // Invalidate cache
    cache.profiles = null;
    cache.filters = null;
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete profile',
      message: error.message 
    });
  }
});

// =====================================================
// POST /api/profiles/:slug/experience
// Add experience to profile
// TODO: Add authentication middleware
// =====================================================

router.post('/:slug/experience', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First get the profile to get the ID
    const profile = await profileQueries.getProfileBySlug(slug);
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    const experienceData = req.body;
    const newExperience = await profileQueries.addExperience(profile.id, experienceData);
    
    res.status(201).json({
      success: true,
      data: newExperience,
      message: 'Experience added successfully'
    });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add experience',
      message: error.message 
    });
  }
});

module.exports = router;


