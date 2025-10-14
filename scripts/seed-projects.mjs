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

async function seedProjects() {
  console.log('Fetching people...');

  // Fetch people to get their IDs
  const people = await client.fetch(`*[_type=="person"]{_id, name}`);
  console.log(`Found ${people.length} people`);

  const jovanni = people.find(p => p.name.includes('Jovanni'));
  const sarah = people.find(p => p.name.includes('Sarah'));
  const marcus = people.find(p => p.name.includes('Marcus'));

  if (!jovanni || !sarah || !marcus) {
    console.error('Could not find all people. Make sure to run seed-dummy-data.mjs first.');
    return;
  }

  const projects = [
    {
      _type: 'project',
      title: 'TaskFlow',
      slug: { _type: 'slug', current: 'taskflow' },
      summary: 'A collaborative task management app with real-time updates and team coordination features.',
      skills: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Express'],
      sectors: ['Productivity', 'SaaS'],
      participants: [
        { _type: 'reference', _ref: jovanni._id },
        { _type: 'reference', _ref: sarah._id },
      ],
      githubUrl: 'https://github.com/example/taskflow',
      liveUrl: 'https://taskflow-demo.com',
    },
    {
      _type: 'project',
      title: 'HealthTrack',
      slug: { _type: 'slug', current: 'healthtrack' },
      summary: 'A mobile-first health tracking application that helps users monitor their fitness goals and wellness metrics.',
      skills: ['React Native', 'Python', 'Django', 'PostgreSQL', 'AWS'],
      sectors: ['Healthcare', 'Mobile'],
      participants: [
        { _type: 'reference', _ref: marcus._id },
        { _type: 'reference', _ref: sarah._id },
      ],
      githubUrl: 'https://github.com/example/healthtrack',
      liveUrl: 'https://healthtrack-app.com',
    },
    {
      _type: 'project',
      title: 'LearnHub',
      slug: { _type: 'slug', current: 'learnhub' },
      summary: 'An interactive learning platform with video courses, quizzes, and peer-to-peer study groups.',
      skills: ['Next.js', 'TypeScript', 'GraphQL', 'Prisma', 'Vercel'],
      sectors: ['Education', 'EdTech'],
      participants: [
        { _type: 'reference', _ref: jovanni._id },
        { _type: 'reference', _ref: marcus._id },
      ],
      githubUrl: 'https://github.com/example/learnhub',
      liveUrl: 'https://learnhub-platform.com',
    },
    {
      _type: 'project',
      title: 'ShopLocal',
      slug: { _type: 'slug', current: 'shoplocal' },
      summary: 'A marketplace connecting local businesses with customers, featuring inventory management and delivery tracking.',
      skills: ['Vue.js', 'Ruby on Rails', 'Stripe', 'Redis', 'Docker'],
      sectors: ['E-commerce', 'Local Business'],
      participants: [
        { _type: 'reference', _ref: sarah._id },
        { _type: 'reference', _ref: jovanni._id },
      ],
      githubUrl: 'https://github.com/example/shoplocal',
      liveUrl: 'https://shoplocal-marketplace.com',
    },
    {
      _type: 'project',
      title: 'DataViz Pro',
      slug: { _type: 'slug', current: 'dataviz-pro' },
      summary: 'A data visualization tool that transforms complex datasets into interactive charts and dashboards.',
      skills: ['Python', 'D3.js', 'Flask', 'TensorFlow', 'Kubernetes'],
      sectors: ['Analytics', 'Enterprise'],
      participants: [
        { _type: 'reference', _ref: marcus._id },
      ],
      githubUrl: 'https://github.com/example/dataviz-pro',
      liveUrl: 'https://dataviz-pro.com',
    },
    {
      _type: 'project',
      title: 'ChatConnect',
      slug: { _type: 'slug', current: 'chatconnect' },
      summary: 'Real-time messaging application with end-to-end encryption, group chats, and file sharing.',
      skills: ['React', 'WebSockets', 'Go', 'MongoDB', 'WebRTC'],
      sectors: ['Communication', 'Social'],
      participants: [
        { _type: 'reference', _ref: jovanni._id },
      ],
      githubUrl: 'https://github.com/example/chatconnect',
      liveUrl: 'https://chatconnect-app.com',
    },
  ];

  console.log('\nCreating projects...');

  for (const project of projects) {
    try {
      const result = await client.create(project);
      console.log(`✓ Created project: ${project.title} (${result._id})`);
    } catch (error) {
      console.error(`✗ Failed to create ${project.title}:`, error);
    }
  }

  console.log('\n✨ Done seeding projects!');
}

seedProjects();
