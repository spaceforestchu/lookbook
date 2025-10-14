import { getAllPeople } from '@/sanity/lib/queries';
import PersonCard from '@/components/PersonCard';
import FilterBar from '@/components/FilterBar';

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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">People</h1>
      <p className="text-gray-600 mb-6">
        Meet the talented individuals in our lookbook.
      </p>

      {/* Filter Bar */}
      <FilterBar allSkills={allSkills} />

      {/* Results Grid */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map((person) => (
            <PersonCard key={person.slug} person={person} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No people match your filters.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
