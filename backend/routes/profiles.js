// Profile routes for Lookbook API
// Following test-pilot-server pattern

const express = require('express');
const router = express.Router();
const profileQueries = require('../queries/profileQueries');

// =====================================================
// GET /api/profiles
// Get all profiles with optional filtering
// =====================================================

router.get('/', async (req, res) => {
  try {
    const { search, skills, openToWork, industries, limit, offset, page } = req.query;
    
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
    
    res.json({
      success: true,
      data: result.profiles,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        page: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
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
    const [skills, industries] = await Promise.all([
      profileQueries.getAllSkills(),
      profileQueries.getAllIndustries()
    ]);
    
    res.json({
      success: true,
      data: {
        skills,
        industries
      }
    });
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
    if (!profileData.userId || !profileData.slug) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, slug'
      });
    }
    
    const newProfile = await profileQueries.createProfile(profileData);
    
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
    
    const updatedProfile = await profileQueries.updateProfile(slug, updates);
    
    if (!updatedProfile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
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


