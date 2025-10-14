'use client';

import Link from 'next/link';
import { trackCardClick } from '@/lib/analytics.client';

// Accept minimal project shape (for related projects on person pages)
type ProjectCardProps = {
  project: {
    slug: string;
    title: string;
    summary?: string;
    skills?: string[];
    sectors?: string[];
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  // Display up to 2 skills only (handle null/undefined skills)
  const displayedSkills = project.skills?.slice(0, 2) || [];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block border border-gray-300 rounded-lg p-5 hover:shadow-md hover:border-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={() => trackCardClick('project', project.slug)}
    >
      <div className="flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>

        {/* Summary */}
        {project.summary && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.summary}
          </p>
        )}

        {/* Skills badges */}
        {displayedSkills.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {displayedSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {(project.skills?.length || 0) > 2 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{(project.skills?.length || 0) - 2} more
              </span>
            )}
          </div>
        )}

        {/* View project link hint */}
        <div className="text-sm text-blue-600 font-medium mt-1">
          View project →
        </div>
      </div>
    </Link>
  );
}
