'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackSearch, trackFilter, trackFiltersCleared } from '@/lib/analytics.client';

interface ProjectFilterBarProps {
  allSkills: string[];
  allSectors: string[];
}

export default function ProjectFilterBar({
  allSkills,
  allSectors,
}: ProjectFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skills')?.split(',').filter(Boolean) || []
  );
  const [selectedSectors, setSelectedSectors] = useState<string[]>(
    searchParams.get('sectors')?.split(',').filter(Boolean) || []
  );

  // Sync filters to URL whenever state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    if (selectedSkills.length > 0) {
      params.set('skills', selectedSkills.join(','));
    }

    if (selectedSectors.length > 0) {
      params.set('sectors', selectedSectors.join(','));
    }

    // Update URL without full page reload
    const queryString = params.toString();
    router.push(queryString ? `/projects?${queryString}` : '/projects', {
      scroll: false,
    });
  }, [searchQuery, selectedSkills, selectedSectors, router]);

  // Handle skill checkbox toggle
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => {
      const nextSkills = prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill];
      trackFilter('projects', 'skills', nextSkills.length);
      return nextSkills;
    });
  };

  // Handle sector checkbox toggle
  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) => {
      const nextSectors = prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector];
      trackFilter('projects', 'sectors', nextSectors.length);
      return nextSectors;
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedSectors([]);
    trackFiltersCleared('projects');
  };

  const hasActiveFilters =
    searchQuery || selectedSkills.length > 0 || selectedSectors.length > 0;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div>
          <label
            htmlFor="project-search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search projects
          </label>
          <input
            id="project-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchQuery(nextValue);
              trackSearch('projects', nextValue);
            }}
            placeholder="e.g., Dashboard, Analytics, Design..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Skills Multi-Select */}
        {allSkills.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by skills
            </label>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`inline-flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill)}
                      className="sr-only"
                      aria-checked={isSelected}
                    />
                    <span className="text-sm font-medium">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Sectors Multi-Select */}
        {allSectors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by sectors
            </label>
            <div className="flex flex-wrap gap-2">
              {allSectors.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <label
                    key={sector}
                    className={`inline-flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSectorToggle(sector)}
                      className="sr-only"
                      aria-checked={isSelected}
                    />
                    <span className="text-sm font-medium">{sector}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium focus:outline-none focus:underline"
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
