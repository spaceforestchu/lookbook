const pool = require('../db/dbConfig');

/**
 * Get all skills
 */
const getAllSkills = async () => {
  const query = `
    SELECT id, name, category, display_order
    FROM lookbook_skills
    ORDER BY display_order ASC, name ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Get all industries
 */
const getAllIndustries = async () => {
  const query = `
    SELECT id, name, description, display_order
    FROM lookbook_industries
    ORDER BY display_order ASC, name ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Create a new skill
 */
const createSkill = async ({ name, category, display_order }) => {
  const query = `
    INSERT INTO lookbook_skills (name, category, display_order)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, category || null, display_order || 0]);
  return result.rows[0];
};

/**
 * Create a new industry
 */
const createIndustry = async ({ name, description, display_order }) => {
  const query = `
    INSERT INTO lookbook_industries (name, description, display_order)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, description || null, display_order || 0]);
  return result.rows[0];
};

/**
 * Update a skill
 */
const updateSkill = async (id, { name, category, display_order }) => {
  const query = `
    UPDATE lookbook_skills
    SET name = $1, category = $2, display_order = $3
    WHERE id = $4
    RETURNING *
  `;
  const result = await pool.query(query, [name, category || null, display_order || 0, id]);
  return result.rows[0];
};

/**
 * Update an industry
 */
const updateIndustry = async (id, { name, description, display_order }) => {
  const query = `
    UPDATE lookbook_industries
    SET name = $1, description = $2, display_order = $3
    WHERE id = $4
    RETURNING *
  `;
  const result = await pool.query(query, [name, description || null, display_order || 0, id]);
  return result.rows[0];
};

/**
 * Delete a skill
 */
const deleteSkill = async (id) => {
  const query = 'DELETE FROM lookbook_skills WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/**
 * Delete an industry
 */
const deleteIndustry = async (id) => {
  const query = 'DELETE FROM lookbook_industries WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getAllSkills,
  getAllIndustries,
  createSkill,
  createIndustry,
  updateSkill,
  updateIndustry,
  deleteSkill,
  deleteIndustry
};

