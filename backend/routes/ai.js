// AI routes for Lookbook API
// Resume/profile extraction using OpenAI

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// =====================================================
// POST /api/ai/extract
// Extract profile data from resume/LinkedIn text
// =====================================================

router.post('/extract', async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        success: false,
        error: 'AI extraction not available',
        message: 'OPENAI_API_KEY not configured'
      });
    }
    
    const { sourceText } = req.body;
    
    if (!sourceText || sourceText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Source text is required and must be at least 50 characters'
      });
    }
    
    const prompt = `Extract professional profile information from the following resume/LinkedIn text.
Return ONLY a JSON object with these fields (use null if not found):
- name: string
- title: string (current/most recent job title)
- bio: string (2-3 sentence professional summary)
- skills: array of strings (technical skills, max 12)
- industryExpertise: array of strings (industries/domains)
- openToWork: boolean (true if actively seeking, false otherwise)
- highlights: array of strings (3-5 key achievements)
- experience: array of objects with {org, role, dateFrom, dateTo, summary}

Text to extract from:
${sourceText}`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts structured data from resumes and professional profiles. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });
    
    const responseText = completion.choices[0].message.content;
    
    // Try to parse the JSON
    let extracted;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      extracted = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: responseText
      });
    }
    
    // Generate slug from name
    if (extracted.name) {
      extracted.suggestedSlug = extracted.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    res.json({
      success: true,
      data: extracted,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      }
    });
    
  } catch (error) {
    console.error('Error in AI extraction:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI extraction failed',
      message: error.message 
    });
  }
});

// =====================================================
// POST /api/ai/sanitize
// Normalize and moderate extracted profile data
// =====================================================

router.post('/sanitize', async (req, res) => {
  try {
    const { profileData } = req.body;
    
    if (!profileData) {
      return res.status(400).json({
        success: false,
        error: 'profileData is required'
      });
    }
    
    const sanitized = { ...profileData };
    const report = {
      errors: [],
      warnings: [],
      changes: []
    };
    
    // Normalize skills (limit to 12, dedupe, trim)
    if (sanitized.skills && Array.isArray(sanitized.skills)) {
      const originalSkills = [...sanitized.skills];
      sanitized.skills = [...new Set(
        sanitized.skills
          .map(s => s.trim())
          .filter(s => s.length > 0 && s.length <= 30)
          .slice(0, 12)
      )].sort();
      
      if (sanitized.skills.length !== originalSkills.length) {
        report.changes.push(`Skills normalized: ${originalSkills.length} → ${sanitized.skills.length}`);
      }
    }
    
    // Validate name length
    if (sanitized.name && sanitized.name.length > 80) {
      report.warnings.push('Name exceeds 80 characters');
    }
    
    // Validate title length
    if (sanitized.title && sanitized.title.length > 80) {
      report.warnings.push('Title exceeds 80 characters');
    }
    
    // Check for potential PII in bio
    if (sanitized.bio) {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
      
      if (emailRegex.test(sanitized.bio)) {
        report.warnings.push('Email address detected in bio');
      }
      if (phoneRegex.test(sanitized.bio)) {
        report.warnings.push('Phone number detected in bio');
      }
    }
    
    // Normalize industries
    if (sanitized.industryExpertise && Array.isArray(sanitized.industryExpertise)) {
      sanitized.industryExpertise = [...new Set(
        sanitized.industryExpertise
          .map(i => i.trim())
          .filter(i => i.length > 0)
      )].sort();
    }
    
    // Normalize highlights
    if (sanitized.highlights && Array.isArray(sanitized.highlights)) {
      sanitized.highlights = sanitized.highlights
        .map(h => h.trim())
        .filter(h => h.length > 0)
        .slice(0, 10);
    }
    
    res.json({
      success: true,
      data: sanitized,
      report
    });
    
  } catch (error) {
    console.error('Error sanitizing data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Sanitization failed',
      message: error.message 
    });
  }
});

module.exports = router;


