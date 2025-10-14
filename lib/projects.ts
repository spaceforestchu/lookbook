// Type definition for a Project in the Lookbook
export type Project = {
  id: string;
  slug: string; // Unique kebab-case identifier for URL routing
  title: string;
  summary?: string; // 1-2 line description
  skills: string[]; // Technologies/tools used
  sectors?: string[]; // Industry sectors (e.g., "Fintech", "Healthcare")
  participants: string[]; // Array of person slugs who worked on this
  githubUrl?: string;
  liveUrl?: string;
};

// Mock data: Sample projects for the Lookbook
export const projects: Project[] = [
  {
    id: '1',
    slug: 'design-system-overhaul',
    title: 'Design System Overhaul',
    summary:
      'A comprehensive redesign of the company design system with new components, accessibility improvements, and documentation.',
    skills: ['Figma', 'Design Systems', 'UI/UX'],
    sectors: ['SaaS', 'Enterprise'],
    participants: ['alex-rivera'],
    githubUrl: undefined,
    liveUrl: 'https://example.com/design-system',
  },
  {
    id: '2',
    slug: 'real-time-dashboard',
    title: 'Real-Time Analytics Dashboard',
    summary:
      'Built a high-performance dashboard for visualizing real-time data streams with custom charts and alerting capabilities.',
    skills: ['React', 'TypeScript', 'Node.js'],
    sectors: ['Fintech', 'Analytics'],
    participants: ['jordan-chen', 'casey-kim'],
    githubUrl: 'https://github.com/example/dashboard',
    liveUrl: 'https://dashboard.example.com',
  },
  {
    id: '3',
    slug: 'product-roadmap-tool',
    title: 'Product Roadmap Planning Tool',
    summary:
      'Collaborative roadmapping tool for product teams with timeline views, prioritization frameworks, and stakeholder feedback.',
    skills: ['Strategy', 'Analytics', 'Roadmapping'],
    sectors: ['Productivity', 'SaaS'],
    participants: ['sam-patel', 'jordan-chen'],
    githubUrl: undefined,
    liveUrl: undefined,
  },
  {
    id: '4',
    slug: 'brand-refresh-campaign',
    title: 'Brand Refresh Campaign',
    summary:
      'Complete brand identity refresh including logo redesign, messaging strategy, and multi-channel marketing campaign.',
    skills: ['Branding', 'Marketing', 'Content'],
    sectors: ['Retail', 'E-commerce'],
    participants: ['morgan-lee'],
    githubUrl: undefined,
    liveUrl: 'https://example.com/brand',
  },
  {
    id: '5',
    slug: 'ml-recommendation-engine',
    title: 'ML Recommendation Engine',
    summary:
      'Machine learning pipeline for personalized product recommendations using collaborative filtering and neural networks.',
    skills: ['Python', 'ML/AI', 'SQL'],
    sectors: ['E-commerce', 'AI'],
    participants: ['casey-kim', 'jordan-chen'],
    githubUrl: 'https://github.com/example/ml-engine',
    liveUrl: undefined,
  },
];

// Helper: Get all projects
export function getAllProjects(): Project[] {
  return projects;
}

// Helper: Find a project by its slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
