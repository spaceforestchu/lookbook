import { getAllProjects, type Project } from '@/sanity/lib/queries';
import {
  uniqueSkillsFromProjects,
  uniqueSectorsFromProjects,
  commaListToArray,
} from '@/lib/taxonomy';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilterBar from '@/components/ProjectFilterBar';

// ISR: Revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

interface ProjectsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Get all projects from Sanity
  const allProjects = await getAllProjects();

  // Derive unique skills and sectors for filter bar
  const allSkills = uniqueSkillsFromProjects(allProjects);
  const allSectors = uniqueSectorsFromProjects(allProjects);

  // Extract filter parameters from URL
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const skillsParam = typeof params.skills === 'string' ? params.skills : '';
  const sectorsParam =
    typeof params.sectors === 'string' ? params.sectors : '';

  const selectedSkills = commaListToArray(skillsParam);
  const selectedSectors = commaListToArray(sectorsParam);

  // Filter projects based on query params
  const filteredProjects = allProjects.filter((project: Project) => {
    // Text search: match title OR summary (case-insensitive)
    if (query) {
      const titleMatch = project.title.toLowerCase().includes(query);
      const summaryMatch = project.summary?.toLowerCase().includes(query);
      if (!titleMatch && !summaryMatch) return false;
    }

    // Skills filter: project must have ALL selected skills (AND semantics)
    if (selectedSkills.length > 0) {
      const hasAllSkills = selectedSkills.every((skill) =>
        project.skills.includes(skill)
      );
      if (!hasAllSkills) return false;
    }

    // Sectors filter: project must have ALL selected sectors (AND semantics)
    if (selectedSectors.length > 0) {
      const projectSectors = project.sectors ?? [];
      const hasAllSectors = selectedSectors.every((sector) =>
        projectSectors.includes(sector)
      );
      if (!hasAllSectors) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-gray-600 mb-6">
        Explore our portfolio of projects and collaborations.
      </p>

      {/* Filter Bar */}
      <ProjectFilterBar allSkills={allSkills} allSectors={allSectors} />

      {/* Results Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No projects match your filters.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
