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

const dummyPeople = [
  {
    _type: 'person',
    name: 'Jovanni Luna',
    slug: { _type: 'slug', current: 'jovanni-luna' },
    title: 'Full-Stack Software Engineer',
    bio: 'A child of immigrants and a proud New Yorker, Jovanni knew that he wanted to go into technology as a kid. He gained business, logistics, and customer skills working as a lead concierge at a luxury building and a sales associate at Best Buy.\n\nAfter completing Pursuit, Jovanni worked as a Software Engineer II at Foursquare. He focused on backend engineering, developing scalable systems with Scala, Python, PostgreSQL, and MongoDB.',
    skills: ['JavaScript', 'Ruby', 'SQL', 'MongoDB', 'PostgreSQL', 'React', 'Ruby on Rails', 'Node.js', 'Express', 'Next.js'],
    openToWork: true,
    highlights: ['3 years of experience at FSQ', 'Customer service and consumer expert'],
    industryExpertise: ['AI', 'TRAVEL', 'CONSUMER'],
    links: {
      linkedin: 'https://linkedin.com/in/jovanniluna',
      github: 'https://github.com/jovanniluna',
      website: 'https://jovanniluna.com',
      x: 'https://twitter.com/jovanniluna',
    },
    experience: [
      {
        org: 'Foursquare',
        role: 'Software Engineer II',
        dateFrom: '2021',
        dateTo: '2024',
        summary: 'Backend engineering with Scala, Python, PostgreSQL, MongoDB',
      },
      {
        org: 'Pursuit',
        role: 'Fellowship: Full-stack Web',
        dateFrom: '2019',
        dateTo: '2021',
        summary: 'Intensive software engineering fellowship',
      },
      {
        org: 'PBS Facility Service',
        role: 'Lead Concierge',
        dateFrom: '2016',
        dateTo: '2019',
        summary: 'Customer service at luxury building',
      },
    ],
  },
  {
    _type: 'person',
    name: 'Sarah Chen',
    slug: { _type: 'slug', current: 'sarah-chen' },
    title: 'Product Designer & UX Lead',
    bio: 'Sarah is a product designer with a passion for creating intuitive, accessible experiences. With a background in cognitive science and 8 years of design experience, she has led design teams at multiple startups and helped ship products used by millions.\n\nShe believes in design systems, user research, and the power of collaboration between design and engineering.',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'HTML/CSS'],
    openToWork: false,
    highlights: ['Led design for 10M+ user products', 'Built 3 design systems from scratch'],
    industryExpertise: ['FINTECH', 'HEALTHTECH', 'CONSUMER'],
    links: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      website: 'https://sarahchen.design',
      x: 'https://twitter.com/sarahchen',
    },
    experience: [
      {
        org: 'Stripe',
        role: 'Senior Product Designer',
        dateFrom: '2020',
        dateTo: '2024',
        summary: 'Led checkout experience redesign and design system evolution',
      },
      {
        org: 'Oscar Health',
        role: 'Product Designer',
        dateFrom: '2018',
        dateTo: '2020',
        summary: 'Designed member-facing health insurance platform',
      },
      {
        org: 'Parsons School of Design',
        role: 'MFA Design + Technology',
        dateFrom: '2016',
        dateTo: '2018',
        summary: 'Masters in Design and Technology',
      },
    ],
  },
  {
    _type: 'person',
    name: 'Marcus Johnson',
    slug: { _type: 'slug', current: 'marcus-johnson' },
    title: 'Machine Learning Engineer',
    bio: 'Marcus specializes in building and deploying ML models at scale. From recommendation systems to computer vision, he has worked across the ML stack. He previously led the ML infrastructure team at a Series C startup.\n\nHe is passionate about making AI more accessible and interpretable, and regularly contributes to open-source ML tools.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'AWS', 'Kubernetes', 'MLOps', 'NLP', 'Computer Vision'],
    openToWork: true,
    highlights: ['PhD in Computer Science (ML)', 'Built ML platform serving 100M+ predictions/day'],
    industryExpertise: ['AI', 'EDTECH', 'FINTECH'],
    links: {
      linkedin: 'https://linkedin.com/in/marcusjohnson',
      github: 'https://github.com/marcusj',
      website: 'https://marcusj.ai',
    },
    experience: [
      {
        org: 'Databricks',
        role: 'Senior ML Engineer',
        dateFrom: '2021',
        dateTo: '2024',
        summary: 'Built MLOps platform and deployed models for enterprise customers',
      },
      {
        org: 'Coursera',
        role: 'ML Engineer',
        dateFrom: '2019',
        dateTo: '2021',
        summary: 'Recommendation systems and personalization algorithms',
      },
      {
        org: 'Stanford University',
        role: 'PhD Computer Science',
        dateFrom: '2015',
        dateTo: '2019',
        summary: 'Research in deep learning and computer vision',
      },
    ],
  },
];

async function seedData() {
  console.log('Starting to seed dummy data...');

  for (const person of dummyPeople) {
    try {
      const result = await client.create(person);
      console.log(`✓ Created person: ${person.name} (${result._id})`);
    } catch (error) {
      console.error(`✗ Failed to create ${person.name}:`, error);
    }
  }

  console.log('\n✨ Done seeding data!');
}

seedData();
