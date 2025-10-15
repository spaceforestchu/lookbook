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
      filename: `person-${Date.now()}.jpg`,
    });

    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function updatePeoplePhotos() {
  console.log('Fetching people...');

  const people = await client.fetch(`*[_type=="person"]{_id, name}`);
  console.log(`Found ${people.length} people\n`);

  const photos = {
    'Jovanni Luna': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    'Sarah Chen': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    'Marcus Johnson': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop',
  };

  for (const person of people) {
    const photoUrl = photos[person.name];
    if (!photoUrl) continue;

    console.log(`Uploading photo for ${person.name}...`);
    const assetId = await uploadImageFromUrl(photoUrl);

    if (assetId) {
      await client
        .patch(person._id)
        .set({
          photo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetId,
            },
          },
        })
        .commit();

      console.log(`✓ Updated ${person.name} with photo\n`);
    } else {
      console.log(`✗ Failed to upload photo for ${person.name}\n`);
    }
  }

  console.log('✨ Done updating photos!');
}

updatePeoplePhotos();
