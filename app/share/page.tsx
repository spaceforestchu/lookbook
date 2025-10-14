import { getAllPeople, getAllProjects, type Person, type Project } from '@/sanity/lib/queries';
import ShareClient from './ShareClient';

export const revalidate = 300;

export default async function SharePage() {
  const [people, projects] = await Promise.all([getAllPeople(), getAllProjects()]);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Share Pack</h1>
      <p className="text-sm text-neutral-600 mt-1">Select People and Projects to generate a recruiter-ready PDF.</p>
      <ShareClient
        people={people.map((p: Person) => ({ slug: p.slug, name: p.name }))}
        projects={projects.map((p: Project) => ({ slug: p.slug, title: p.title }))}
      />
    </main>
  );
}
