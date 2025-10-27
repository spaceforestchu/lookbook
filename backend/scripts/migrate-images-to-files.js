#!/usr/bin/env node
// Script to migrate base64 images to file URLs
require('dotenv').config();
const { pool } = require('../db/dbConfig');
const { base64ToFile, isBase64Image } = require('../utils/imageConverter');

async function migrateImages() {
  console.log('🚀 Starting image migration...\n');

  try {
    // Migrate profile photos
    console.log('📸 Migrating profile photos...');
    const profilesResult = await pool.query(`
      SELECT id, slug, photo_url 
      FROM lookbook_profiles 
      WHERE photo_url IS NOT NULL AND photo_url LIKE 'data:image%'
    `);

    let profileCount = 0;
    for (const profile of profilesResult.rows) {
      if (isBase64Image(profile.photo_url)) {
        const fileUrl = base64ToFile(profile.photo_url, 'profiles', `${profile.slug}-`);
        await pool.query(
          'UPDATE lookbook_profiles SET photo_url = $1 WHERE id = $2',
          [fileUrl, profile.id]
        );
        profileCount++;
        console.log(`  ✓ Converted profile: ${profile.slug}`);
      }
    }
    console.log(`✅ Migrated ${profileCount} profile photos\n`);

    // Migrate project main images
    console.log('🖼️  Migrating project main images...');
    const projectsResult = await pool.query(`
      SELECT id, slug, main_image_url 
      FROM lookbook_projects 
      WHERE main_image_url IS NOT NULL AND main_image_url LIKE 'data:image%'
    `);

    let projectMainCount = 0;
    for (const project of projectsResult.rows) {
      if (isBase64Image(project.main_image_url)) {
        const fileUrl = base64ToFile(project.main_image_url, 'projects', `${project.slug}-main-`);
        await pool.query(
          'UPDATE lookbook_projects SET main_image_url = $1 WHERE id = $2',
          [fileUrl, project.id]
        );
        projectMainCount++;
        console.log(`  ✓ Converted project main image: ${project.slug}`);
      }
    }
    console.log(`✅ Migrated ${projectMainCount} project main images\n`);

    // Skip screenshots migration if column doesn't exist
    // Migrate project screenshots (stored as JSON arrays)
    console.log('📷 Checking for project screenshots...');
    let projectScreenshotCount = 0;
    try {
      const projectScreenshotsResult = await pool.query(`
        SELECT id, slug, screenshots 
        FROM lookbook_projects 
        WHERE screenshots IS NOT NULL
        LIMIT 1
      `);
      
      // Column exists, do full migration
      const allScreenshotsResult = await pool.query(`
        SELECT id, slug, screenshots 
        FROM lookbook_projects 
        WHERE screenshots IS NOT NULL
      `);

      for (const project of allScreenshotsResult.rows) {
        if (!project.screenshots) continue;

        let screenshots;
        try {
          screenshots = typeof project.screenshots === 'string' 
            ? JSON.parse(project.screenshots) 
            : project.screenshots;
        } catch {
          continue;
        }

        if (!Array.isArray(screenshots)) continue;

        let modified = false;
        const newScreenshots = screenshots.map((screenshot, idx) => {
          const url = typeof screenshot === 'string' ? screenshot : screenshot.url;
          if (isBase64Image(url)) {
            modified = true;
            const fileUrl = base64ToFile(url, 'projects', `${project.slug}-screenshot-${idx}-`);
            projectScreenshotCount++;
            return typeof screenshot === 'string' ? fileUrl : { ...screenshot, url: fileUrl };
          }
          return screenshot;
        });

        if (modified) {
          await pool.query(
            'UPDATE lookbook_projects SET screenshots = $1 WHERE id = $2',
            [JSON.stringify(newScreenshots), project.id]
          );
          console.log(`  ✓ Converted ${projectScreenshotCount} screenshots for: ${project.slug}`);
        }
      }
      console.log(`✅ Migrated ${projectScreenshotCount} project screenshots\n`);
    } catch (error) {
      if (error.code === '42703') {
        console.log(`⏭️  Skipping screenshots (column doesn't exist)\n`);
      } else {
        throw error;
      }
    }

    // Migrate project icon URLs
    console.log('🎯 Migrating project icons...');
    const projectIconsResult = await pool.query(`
      SELECT id, slug, icon_url 
      FROM lookbook_projects 
      WHERE icon_url IS NOT NULL AND icon_url LIKE 'data:image%'
    `);

    let projectIconCount = 0;
    for (const project of projectIconsResult.rows) {
      if (isBase64Image(project.icon_url)) {
        const fileUrl = base64ToFile(project.icon_url, 'projects', `${project.slug}-icon-`);
        await pool.query(
          'UPDATE lookbook_projects SET icon_url = $1 WHERE id = $2',
          [fileUrl, project.id]
        );
        projectIconCount++;
        console.log(`  ✓ Converted project icon: ${project.slug}`);
      }
    }
    console.log(`✅ Migrated ${projectIconCount} project icons\n`);

    // Migrate partner logos
    console.log('🤝 Migrating partner logos...');
    const partnerLogosResult = await pool.query(`
      SELECT id, slug, partner_logo_url 
      FROM lookbook_projects 
      WHERE partner_logo_url IS NOT NULL AND partner_logo_url LIKE 'data:image%'
    `);

    let partnerLogoCount = 0;
    for (const project of partnerLogosResult.rows) {
      if (isBase64Image(project.partner_logo_url)) {
        const fileUrl = base64ToFile(project.partner_logo_url, 'projects', `${project.slug}-partner-`);
        await pool.query(
          'UPDATE lookbook_projects SET partner_logo_url = $1 WHERE id = $2',
          [fileUrl, project.id]
        );
        partnerLogoCount++;
        console.log(`  ✓ Converted partner logo: ${project.slug}`);
      }
    }
    console.log(`✅ Migrated ${partnerLogoCount} partner logos\n`);

    const totalMigrated = profileCount + projectMainCount + projectScreenshotCount + projectIconCount + partnerLogoCount;
    console.log(`\n🎉 Migration complete! Converted ${totalMigrated} total images to files.`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrateImages();

