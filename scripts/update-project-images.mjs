import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read token from .env.local
const envContent = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
const tokenMatch = envContent.match(/SANITY_API_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

if (!token) {
  console.error('❌ SANITY_API_TOKEN not found in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: 'uepkot67',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

async function uploadImageFromUrl(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `project-${Date.now()}.jpg`,
    });

    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function updateProjectImages() {
  console.log('Fetching projects...');

  const projects = await client.fetch(`*[_type=="project"]{_id, title}`);
  console.log(`Found ${projects.length} projects\n`);

  // Project cover images - various app/dashboard screenshots
  const images = {
    'TaskFlow': 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop',
    'HealthTrack': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop',
    'LearnHub': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop',
    'ShopLocal': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
    'DataViz Pro': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    'ChatConnect': 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&h=800&fit=crop',
  };

  for (const project of projects) {
    const imageUrl = images[project.title];
    if (!imageUrl) continue;

    console.log(`Uploading image for ${project.title}...`);
    const assetId = await uploadImageFromUrl(imageUrl);

    if (assetId) {
      await client
        .patch(project._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetId,
            },
          },
        })
        .commit();

      console.log(`✓ Updated ${project.title} with image\n`);
    } else {
      console.log(`✗ Failed to upload image for ${project.title}\n`);
    }
  }

  console.log('✨ Done updating project images!');
}

updateProjectImages();
