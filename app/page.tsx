'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterSidebar, { type FilterState } from '@/components/FilterSidebar';
import { getAllPeople, getAllProjects, getPersonBySlug, type Person, type Project } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

type ViewMode = 'grid' | 'list';

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({ industries: [], hasOpenToWork: false });

  useEffect(() => {
    async function fetchData() {
      try {
        const [peopleData, projectsData] = await Promise.all([
          getAllPeople(),
          getAllProjects()
        ]);
        setPeople(peopleData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter people based on selected filters
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      // Filter by industry
      if (filters.industries.length > 0) {
        const hasMatchingIndustry = person.industryExpertise?.some(
          industry => filters.industries.includes(industry)
        );
        if (!hasMatchingIndustry) return false;
      }

      // Filter by open to work
      if (filters.hasOpenToWork && !person.openToWork) {
        return false;
      }

      return true;
    });
  }, [people, filters]);

  const openModal = async (index: number) => {
    setSelectedPersonIndex(index);
    const slug = filteredPeople[index].slug;
    try {
      const person = await getPersonBySlug(slug);
      if (person) {
        setSelectedPerson(person);
      }
    } catch (error) {
      console.error('Error fetching person:', error);
    }
  };

  const closeModal = () => {
    setSelectedPersonIndex(null);
    setSelectedPerson(null);
  };

  const selectedProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;

  const openProjectModal = (slug: string) => {
    const projectIndex = projects.findIndex(p => p.slug === slug);
    if (projectIndex !== -1) {
      setSelectedProjectIndex(projectIndex);
      setSelectedPerson(null); // Close person modal if open
    }
  };

  const closeProjectModal = () => {
    setSelectedProjectIndex(null);
  };

  const goToPreviousProject = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex > 0) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };

  const goToNextProject = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex < projects.length - 1) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  const openPersonModal = async (slug: string) => {
    try {
      const person = await getPersonBySlug(slug);
      if (person) {
        setSelectedPerson(person);
        setSelectedProjectIndex(null); // Close project modal
      }
    } catch (error) {
      console.error('Error fetching person:', error);
    }
  };

  const goToPrevious = async () => {
    if (selectedPersonIndex !== null && selectedPersonIndex > 0) {
      const newIndex = selectedPersonIndex - 1;
      setSelectedPersonIndex(newIndex);
      const slug = filteredPeople[newIndex].slug;
      try {
        const person = await getPersonBySlug(slug);
        if (person) {
          setSelectedPerson(person);
        }
      } catch (error) {
        console.error('Error fetching person:', error);
      }
    }
  };

  const goToNext = async () => {
    if (selectedPersonIndex !== null && selectedPersonIndex < filteredPeople.length - 1) {
      const newIndex = selectedPersonIndex + 1;
      setSelectedPersonIndex(newIndex);
      const slug = filteredPeople[newIndex].slug;
      try {
        const person = await getPersonBySlug(slug);
        if (person) {
          setSelectedPerson(person);
        }
      } catch (error) {
        console.error('Error fetching person:', error);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#E8E8E8]">
        {/* Left Sidebar */}
        <FilterSidebar currentPage="people" filters={filters} onFilterChange={setFilters} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-[#E8E8E8] pb-24 md:pb-8">
        {/* Top Bar */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">FELLOWS</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-sm text-neutral-600">{filteredPeople.length} of {people.length}</span>
            <div className="flex gap-1 border border-neutral-300 rounded bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 hover:bg-neutral-50 rounded-l ${viewMode === 'grid' ? 'bg-neutral-100' : ''}`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 hover:bg-neutral-50 rounded-r ${viewMode === 'list' ? 'bg-neutral-100' : ''}`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Loading...</p>
          </div>
        ) : (
            <div className={
              viewMode === 'list'
                ? 'space-y-4'
                : 'grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }>
            {filteredPeople.map((person, index) => {
              const imageUrl = person.photo ? urlForImage(person.photo)?.width(400).height(400).fit('crop').url() : null;

              return viewMode === 'list' ? (
                // List View Layout
                <button
                  key={person.slug}
                  onClick={() => openModal(index)}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl text-left flex flex-col sm:flex-row h-auto sm:h-40 w-full"
                >
                  {/* Left side - Image */}
                  <div className="relative w-full sm:w-64 h-48 sm:h-full flex-shrink-0 overflow-hidden bg-neutral-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={person.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 256px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-neutral-300 text-4xl font-bold text-neutral-500">
                        {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Right side - Content */}
                  <div className="flex-1 p-4 sm:p-6 flex items-center justify-between min-w-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">{person.name}</h3>
                      {person.title && <p className="text-sm text-neutral-600 mb-2 sm:mb-3 truncate">{person.title}</p>}
                      <div className="flex flex-wrap gap-1">
                        {person.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                            {skill}
                          </span>
                        ))}
                        {person.skills.length > 4 && (
                          <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                            +{person.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ) : (
                // Grid View Layout
                <button
                  key={person.slug}
                  onClick={() => openModal(index)}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl text-left"
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
                    {person.title && <p className="mb-3 text-sm text-neutral-600">{person.title}</p>}
                    <div className="flex flex-wrap gap-1">
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
                </button>
              );
            })}
          </div>
        )}
        </main>
      </div>

      {/* Modal */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
          onClick={closeModal}
        >
            {/* Navigation Arrows */}
            {selectedPersonIndex !== null && selectedPersonIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-neutral-50 transition z-10"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {selectedPersonIndex !== null && selectedPersonIndex < filteredPeople.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-neutral-50 transition z-10"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Modal Content */}
            <div
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 rounded-full bg-neutral-100 p-1.5 sm:p-2 hover:bg-neutral-200 transition"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Profile Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
                  {/* Photo */}
                  <div className="relative w-full md:w-64 h-64 flex-shrink-0">
                    {selectedPerson.photo && urlForImage(selectedPerson.photo)?.width(256).height(256).fit('crop').url() ? (
                      <Image
                        src={urlForImage(selectedPerson.photo)!.width(256).height(256).fit('crop').url()!}
                        alt={selectedPerson.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-neutral-300 text-4xl sm:text-6xl font-bold text-neutral-500 rounded-lg">
                        {selectedPerson.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl sm:text-3xl font-bold pr-10">{selectedPerson.name}</h2>
                      <div className="flex gap-2">
                        {selectedPerson.links?.x && (
                          <a href={selectedPerson.links.x} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        {selectedPerson.links?.linkedin && (
                          <a href={selectedPerson.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                        {selectedPerson.links?.website && (
                          <a href={selectedPerson.links.website} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-4">{selectedPerson.title || 'No title'}</p>
                    {selectedPerson.bio && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-sm mb-2">Bio & Credentials</h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-line">{selectedPerson.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Four Column Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Highlights */}
                  {selectedPerson.highlights && selectedPerson.highlights.length > 0 && (
                    <div className="bg-black text-white rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Highlights</h3>
                      <div className="space-y-3">
                        {selectedPerson.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-xs">
                              ✓
                            </div>
                            <p className="text-sm">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedPerson.experience && selectedPerson.experience.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 text-sm">Experience + Education</h3>
                      <div className="space-y-4">
                        {selectedPerson.experience.map((exp, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-700">
                              {exp.org ? exp.org.substring(0, 2).toUpperCase() : 'EX'}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{exp.org || 'Organization'}</p>
                              <p className="text-xs text-neutral-600">{exp.role || 'Role'}</p>
                              <p className="text-xs text-neutral-500">
                                {exp.dateFrom && exp.dateTo ? `${exp.dateFrom} - ${exp.dateTo}` : 'Dates not specified'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold mb-4 text-sm">Skills</h3>
                    <ul className="space-y-1">
                      {selectedPerson.skills.map((skill, i) => (
                        <li key={i} className="text-sm text-neutral-700">• {skill}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Industry Expertise */}
                  {selectedPerson.industryExpertise && selectedPerson.industryExpertise.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 text-sm">Industry Expertise</h3>
                      <div className="space-y-2">
                        {selectedPerson.industryExpertise.map((industry, i) => {
                          const colors = ['bg-pink-100 text-pink-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800'];
                          return (
                            <div key={i} className={`rounded-full px-3 py-1 text-xs font-medium ${colors[i % colors.length]}`}>
                              {industry}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Select Projects */}
                {selectedPerson.projects && selectedPerson.projects.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-base sm:text-lg">Select Projects</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedPerson.projects.map((project, i) => (
                        <button
                          key={i}
                          onClick={() => openProjectModal(project.slug)}
                          className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition text-left w-full cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-3"></div>
                          <h4 className="font-semibold mb-1">{project.title}</h4>
                          <p className="text-xs text-neutral-600 mb-2">{project.summary || 'No description'}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Position Counter */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
                {selectedPersonIndex !== null && `${selectedPersonIndex + 1} of ${filteredPeople.length}`}
                </div>
              </div>
            </div>
          )}

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
          onClick={closeProjectModal}
        >
          {/* Navigation Arrows */}
          {selectedProjectIndex !== null && selectedProjectIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousProject();
              }}
              className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-neutral-50 transition z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedProjectIndex !== null && selectedProjectIndex < projects.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextProject();
              }}
              className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-neutral-50 transition z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Modal Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeProjectModal}
              className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 rounded-full bg-neutral-100 p-1.5 sm:p-2 hover:bg-neutral-200 transition"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Project Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Hero Section */}
              <div className="relative rounded-xl overflow-hidden mb-6 md:mb-8 h-48 sm:h-64 bg-gradient-to-br from-neutral-800 to-neutral-900">
                {selectedProject.mainImage && urlForImage(selectedProject.mainImage)?.url() && (
                  <Image
                    src={urlForImage(selectedProject.mainImage)!.url()!}
                    alt={selectedProject.title}
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                )}
                <div className="relative h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 text-white">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{selectedProject.title}</h2>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">{selectedProject.summary || 'No description available'}</p>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                {/* Team */}
                {selectedProject.participants && selectedProject.participants.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Project Team</h3>
                    <ul className="space-y-2">
                      {selectedProject.participants.map((member, i) => (
                        <li key={i}>
                          <button
                            onClick={() => openPersonModal(member.slug)}
                            className="flex items-center gap-2 hover:bg-neutral-50 rounded-lg p-2 -ml-2 transition-colors cursor-pointer w-full text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-neutral-700 hover:text-blue-600 transition-colors">{member.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills & Sectors */}
                <div>
                  {selectedProject.skills && selectedProject.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.skills.map((skill, i) => (
                          <span key={i} className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProject.sectors && selectedProject.sectors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sectors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.sectors.map((sector, i) => (
                          <span key={i} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Links Section */}
              <div className="border-t pt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Links</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Position Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
              {selectedProjectIndex !== null && `${selectedProjectIndex + 1} of ${projects.length}`}
            </div>
          </div>
        </div>
      )}
      </>
    );
  }
