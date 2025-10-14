'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

type Project = {
  slug: string;
  title?: string;
  summary?: string;
  mainImage?: any;
  skills?: string[];
  sectors?: string[];
  team?: Array<{ slug: string; name?: string; image?: any }>;
};

type Filters = {
  search: string;
  cohort: string;
  industries: string[];
  hasDemoVideo: boolean | undefined;
  openToRelocate: boolean | undefined;
  openToWork: boolean | undefined;
  freelance: boolean | undefined;
  nycBased: boolean | undefined;
  remoteOnly: boolean | undefined;
};

const COHORTS = ['2024', '2023', '2022', '2021', 'Earlier'];
const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Media',
  'Government',
  'Nonprofit',
  'Other'
];

export default function ProjectsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    cohort: '',
    industries: [],
    hasDemoVideo: undefined,
    openToRelocate: undefined,
    openToWork: undefined,
    freelance: undefined,
    nycBased: undefined,
    remoteOnly: undefined
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 12;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const payload = {
        search: filters.search || undefined,
        cohort: filters.cohort || undefined,
        industries: filters.industries.length > 0 ? filters.industries : undefined,
        hasDemoVideo: filters.hasDemoVideo,
        openToRelocate: filters.openToRelocate,
        openToWork: filters.openToWork,
        freelance: filters.freelance,
        nycBased: filters.nycBased,
        remoteOnly: filters.remoteOnly,
        page,
        perPage
      };

      const res = await fetch('/api/browse/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.ok) {
        setProjects(data.projects || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters, page]);

  const toggleIndustry = (industry: string) => {
    setFilters(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
    setPage(1);
  };

  const toggleFlag = (key: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === true ? undefined : true
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      cohort: '',
      industries: [],
      hasDemoVideo: undefined,
      openToRelocate: undefined,
      openToWork: undefined,
      freelance: undefined,
      nycBased: undefined,
      remoteOnly: undefined
    });
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold">Cohort</h2>
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>
          <select
            value={filters.cohort}
            onChange={e => {
              setFilters(prev => ({ ...prev, cohort: e.target.value }));
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All</option>
            {COHORTS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Industry Expertise</h2>
          <div className="space-y-2">
            {INDUSTRIES.map(ind => (
              <label key={ind} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.industries.includes(ind)}
                  onChange={() => toggleIndustry(ind)}
                  className="rounded"
                />
                <span className="text-sm">{ind}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasDemoVideo === true}
                onChange={() => toggleFlag('hasDemoVideo')}
                className="rounded"
              />
              <span className="text-sm">Has Demo Video</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.openToRelocate === true}
                onChange={() => toggleFlag('openToRelocate')}
                className="rounded"
              />
              <span className="text-sm">Open to Relocate</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.openToWork === true}
                onChange={() => toggleFlag('openToWork')}
                className="rounded"
              />
              <span className="text-sm">Open to Work</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.freelance === true}
                onChange={() => toggleFlag('freelance')}
                className="rounded"
              />
              <span className="text-sm">Freelance</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.nycBased === true}
                onChange={() => toggleFlag('nycBased')}
                className="rounded"
              />
              <span className="text-sm">NYC-based</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.remoteOnly === true}
                onChange={() => toggleFlag('remoteOnly')}
                className="rounded"
              />
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
            <Link href="/projects" className="rounded-full border bg-black px-3 py-1 text-sm text-white">
              PROJECTS
            </Link>
            <Link href="/people" className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-50">
              PEOPLE
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              {total > 0 ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, total)} of ${total}` : '0 of 0'}
            </span>
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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12 text-gray-500">
            Loading projects...
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects found. Try adjusting your filters.
          </div>
        )}

        {/* Project Grid */}
        {!loading && projects.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map(project => {
                const imageUrl = project.mainImage
                  ? urlForImage(project.mainImage)?.width(600).height(400).url()
                  : null;

                return (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={project.title || 'Project'}
                          fill
                          className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/50">
                          No image
                        </div>
                      )}
                      {/* Title Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="mb-1 text-xl font-bold text-white line-clamp-2">
                          {project.title || 'Untitled'}
                        </h3>
                        {project.summary && (
                          <p className="text-sm text-white/90 line-clamp-2">{project.summary}</p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Team */}
                      {project.team && project.team.length > 0 && (
                        <div className="mb-3">
                          <h4 className="mb-1 text-xs font-semibold text-neutral-500">Project Team</h4>
                          <ul className="space-y-0.5">
                            {project.team.slice(0, 4).map(member => (
                              <li key={member.slug} className="text-sm text-neutral-700">
                                • {member.name || 'Team member'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.skills?.slice(0, 2).map(skill => (
                          <span
                            key={skill}
                            className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.sectors?.slice(0, 1).map(sector => (
                          <span
                            key={sector}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  ← Previous
                </button>
                <span className="text-sm text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
