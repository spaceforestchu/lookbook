// Type definition for a Person in the Lookbook
export type Person = {
  id: string;
  name: string;
  slug: string; // Unique kebab-case identifier for URL routing
  title?: string;
  skills: string[];
  photoUrl?: string;
  openToWork?: boolean;
};

// Mock data: 5 sample people for the Lookbook
export const people: Person[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    slug: 'alex-rivera',
    title: 'Senior Product Designer',
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    photoUrl: undefined, // Will show initials
    openToWork: true,
  },
  {
    id: '2',
    name: 'Jordan Chen',
    slug: 'jordan-chen',
    title: 'Full-Stack Engineer',
    skills: ['React', 'Node.js', 'TypeScript'],
    photoUrl: undefined,
    openToWork: false,
  },
  {
    id: '3',
    name: 'Sam Patel',
    slug: 'sam-patel',
    title: 'Product Manager',
    skills: ['Strategy', 'Analytics', 'Roadmapping'],
    photoUrl: undefined,
    openToWork: true,
  },
  {
    id: '4',
    name: 'Morgan Lee',
    slug: 'morgan-lee',
    title: 'Brand Strategist',
    skills: ['Branding', 'Marketing', 'Content'],
    photoUrl: undefined,
    openToWork: false,
  },
  {
    id: '5',
    name: 'Casey Kim',
    slug: 'casey-kim',
    title: 'Data Scientist',
    skills: ['Python', 'ML/AI', 'SQL'],
    photoUrl: undefined,
    openToWork: true,
  },
];

// Helper: Extract all unique skills from people data, sorted alphabetically
export function getAllSkills(): string[] {
  const skillsSet = new Set<string>();
  people.forEach((person) => {
    person.skills.forEach((skill) => skillsSet.add(skill));
  });
  return Array.from(skillsSet).sort();
}

// Helper: Get all people (for use in components)
export function getAllPeople(): Person[] {
  return people;
}

// Helper: Find a person by their slug
export function getPersonBySlug(slug: string): Person | undefined {
  return people.find((person) => person.slug === slug);
}
