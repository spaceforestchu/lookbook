'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackSearch, trackFilter, trackFiltersCleared } from '@/lib/analytics.client';

interface FilterBarProps {
  allSkills: string[];
}

export default function FilterBar({ allSkills }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skills')?.split(',').filter(Boolean) || []
  );
  const [openToWork, setOpenToWork] = useState(
    searchParams.get('open') === 'true'
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

    if (openToWork) {
      params.set('open', 'true');
    }

    // Update URL without full page reload
    const queryString = params.toString();
    router.push(queryString ? `/people?${queryString}` : '/people', {
      scroll: false,
    });
  }, [searchQuery, selectedSkills, openToWork, router]);

  // Handle skill checkbox toggle
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => {
      const nextSkills = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      trackFilter('people', 'skills', nextSkills.length);
      return nextSkills;
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setOpenToWork(false);
    trackFiltersCleared('people');
  };

  const hasActiveFilters = searchQuery || selectedSkills.length > 0 || openToWork;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by name or title
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchQuery(nextValue);
              trackSearch('people', nextValue);
            }}
            placeholder="e.g., Designer, Engineer, Alex..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Skills Multi-Select */}
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
                      ? 'bg-blue-500 text-white'
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

        {/* Open to Work Toggle + Clear Button */}
        <div className="flex items-center justify-between gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={openToWork}
              onChange={(e) => {
                const nextValue = e.target.checked;
                setOpenToWork(nextValue);
                trackFilter('people', 'open', nextValue);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              aria-checked={openToWork}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Open to work only
            </span>
          </label>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
