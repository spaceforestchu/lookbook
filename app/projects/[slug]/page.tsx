import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug } from '@/sanity/lib/queries';
import Link from 'next/link';
import type { Metadata } from 'next';

// ISR: Revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project: { slug: string }) => ({
    slug: project.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found — Lookbook',
    };
  }

  const description =
    project.summary || `Project involving ${project.skills.join(', ')}`;

  return {
    title: `${project.title} — Lookbook`,
    description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // If project not found, trigger 404
  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 focus:outline-none focus:underline"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Projects
      </Link>

      {/* Main content card */}
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {project.title}
        </h1>

        {/* Summary */}
        {project.summary && (
          <p className="text-lg text-gray-600 mb-6">{project.summary}</p>
        )}

        {/* Links section */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex gap-3 mb-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Live Site
              </a>
            )}
          </div>
        )}

        {/* Skills section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Sectors section */}
        {project.sectors && project.sectors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Sectors
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.sectors.map((sector: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium border border-purple-200"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Participants section */}
        {project.participants.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contributors
            </h2>
            <div className="flex flex-col gap-2">
              {project.participants.map((participant: { slug: string; name: string; title?: string }) => {
                // Participant now comes with slug, name, and title from Sanity
                return (
                  <Link
                    key={participant.slug}
                    href={`/people/${participant.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline w-fit"
                  >
                    {participant.name}
                    {participant.title && (
                      <span className="text-gray-500 font-normal ml-2">
                        — {participant.title}
                      </span>
                    )}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
