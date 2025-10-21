// Project routes for Lookbook API
// Following test-pilot-server pattern

const express = require('express');
const router = express.Router();
const projectQueries = require('../queries/projectQueries');

// =====================================================
// GET /api/projects
// Get all projects with optional filtering
// =====================================================

router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      sectors, 
      cohort, 
      hasDemoVideo, 
      status,
      limit, 
      offset, 
      page 
    } = req.query;
    
    // Parse filters
    const filters = {
      search,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',')) : undefined,
      sectors: sectors ? (Array.isArray(sectors) ? sectors : sectors.split(',')) : undefined,
      cohort,
      hasDemoVideo: hasDemoVideo === 'true' ? true : hasDemoVideo === 'false' ? false : undefined,
      status: status || 'active',
      limit: parseInt(limit) || 50,
      offset: page ? (parseInt(page) - 1) * (parseInt(limit) || 50) : parseInt(offset) || 0
    };
    
    const result = await projectQueries.getAllProjects(filters);
    
    res.json({
      success: true,
      data: result.projects,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        page: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch projects',
      message: error.message 
    });
  }
});

// =====================================================
// GET /api/projects/filters
// Get available filter options
// =====================================================

router.get('/filters', async (req, res) => {
  try {
    const [skills, sectors, cohorts] = await Promise.all([
      projectQueries.getAllSkills(),
      projectQueries.getAllSectors(),
      projectQueries.getAllCohorts()
    ]);
    
    res.json({
      success: true,
      data: {
        skills,
        sectors,
        cohorts
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
// GET /api/projects/:slug
// Get single project by slug
// =====================================================

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await projectQueries.getProjectBySlug(slug);
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch project',
      message: error.message 
    });
  }
});

// =====================================================
// POST /api/projects
// Create new project
// TODO: Add authentication middleware
// =====================================================

router.post('/', async (req, res) => {
  try {
    const projectData = req.body;
    
    // Basic validation
    if (!projectData.slug || !projectData.title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: slug, title'
      });
    }
    
    const newProject = await projectQueries.createProject(projectData);
    
    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle duplicate slug error
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Project with this slug already exists'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create project',
      message: error.message 
    });
  }
});

// =====================================================
// PUT /api/projects/:slug
// Update project
// TODO: Add authentication middleware
// =====================================================

router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;
    
    const updatedProject = await projectQueries.updateProject(slug, updates);
    
    if (!updatedProject) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update project',
      message: error.message 
    });
  }
});

// =====================================================
// DELETE /api/projects/:slug
// Delete project
// TODO: Add authentication middleware
// =====================================================

router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedProject = await projectQueries.deleteProject(slug);
    
    if (!deletedProject) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete project',
      message: error.message 
    });
  }
});

// =====================================================
// POST /api/projects/:slug/participants
// Add participant to project
// TODO: Add authentication middleware
// =====================================================

router.post('/:slug/participants', async (req, res) => {
  try {
    const { slug } = req.params;
    const { profileSlug, role, displayOrder } = req.body;
    
    // Get project and profile IDs
    const project = await projectQueries.getProjectBySlug(slug);
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    // For now, we need to import profile queries to get profile ID
    const profileQueries = require('../queries/profileQueries');
    const profile = await profileQueries.getProfileBySlug(profileSlug);
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    const participant = await projectQueries.addParticipant(
      project.id,
      profile.id,
      role,
      displayOrder || 0
    );
    
    res.status(201).json({
      success: true,
      data: participant,
      message: 'Participant added successfully'
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add participant',
      message: error.message 
    });
  }
});

// =====================================================
// DELETE /api/projects/:slug/participants/:profileSlug
// Remove participant from project
// TODO: Add authentication middleware
// =====================================================

router.delete('/:slug/participants/:profileSlug', async (req, res) => {
  try {
    const { slug, profileSlug } = req.params;
    
    // Get project and profile IDs
    const project = await projectQueries.getProjectBySlug(slug);
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }
    
    const profileQueries = require('../queries/profileQueries');
    const profile = await profileQueries.getProfileBySlug(profileSlug);
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found' 
      });
    }
    
    await projectQueries.removeParticipant(project.id, profile.id);
    
    res.json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove participant',
      message: error.message 
    });
  }
});

module.exports = router;


