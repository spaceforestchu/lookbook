import { getAllPeople } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

// ISR: Revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

interface PeoplePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  // Fetch people from Sanity
  const people = await getAllPeople();

  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Extract filter parameters from URL
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const skillsParam = typeof params.skills === 'string' ? params.skills : '';
  const selectedSkills = skillsParam
    ? skillsParam.split(',').filter(Boolean)
    : [];
  const openToWorkOnly = params.open === 'true';

  // Filter people based on query params
  const filteredPeople = people.filter((person) => {
    // Text search: match name OR title (case-insensitive)
    if (query) {
      const nameMatch = person.name.toLowerCase().includes(query);
      const titleMatch = person.title?.toLowerCase().includes(query);
      if (!nameMatch && !titleMatch) return false;
    }

    // Skills filter: person must have ALL selected skills (AND semantics)
    if (selectedSkills.length > 0) {
      const hasAllSkills = selectedSkills.every((skill) =>
        person.skills.includes(skill)
      );
      if (!hasAllSkills) return false;
    }

    // Open to work filter
    if (openToWorkOnly && !person.openToWork) {
      return false;
    }

    return true;
  });

  // Derive unique skills from fetched data (sorted)
  const allSkills = [...new Set(people.flatMap((p) => p.skills))]
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 8); // Top 8 skills

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 p-6 overflow-y-auto">
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Cohort</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">March '25: AI-Native</span>
            </label>
            <label className="flex items-center gap-2 pl-6">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">11.0: Web</span>
            </label>
            <label className="flex items-center gap-2 pl-6">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">10.0: Web</span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Industry Expertise</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">All</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Consumer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Fintech</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Healthcare</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Real Estate</span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Has Demo Video</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Open to Relocate</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={openToWorkOnly} className="rounded" />
              <span className="text-sm">Open to Work</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Freelance</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">NYC-based</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Remote Only</span>
            </label>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h3 className="mb-2 text-sm font-semibold">Contact for Resume / Hiring Interest</h3>
          <p className="text-sm text-neutral-600 mb-1">Timothy Asprec</p>
          <a href="mailto:timothyasprec@pursuit.org" className="text-sm text-blue-600 hover:underline">
            timothyasprec@pursuit.org
          </a>
          <p className="mt-2 text-xs text-neutral-500">Unauthorized contact violates Fair privacy policies</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-50">
              PROJECTS
            </Link>
            <Link href="/people" className="rounded-full border bg-black px-3 py-1 text-sm text-white">
              PEOPLE
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{filteredPeople.length} of {people.length}</span>
            <div className="flex gap-2">
              <button className="rounded border p-2 hover:bg-neutral-100">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button className="rounded border p-2 hover:bg-neutral-100">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* People Grid */}
        {filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPeople.map((person) => {
              const imageUrl = urlForImage(person.photo)?.width(400).height(400).fit('crop').url();

              return (
                <Link
                  key={person.slug}
                  href={`/people/${person.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={person.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-neutral-300 text-4xl font-bold text-neutral-500">
                        {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold">{person.name}</h3>
                    {person.title && (
                      <p className="mb-3 text-sm text-neutral-600">{person.title}</p>
                    )}

                    {person.openToWork && (
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                        Open to Work
                      </span>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {person.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                          {skill}
                        </span>
                      ))}
                      {person.skills.length > 3 && (
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                          +{person.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">
              No people match your filters.
            </p>
            <p className="text-neutral-400 text-sm mt-2">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
