import { useState } from 'react';
import './FilterBar.css';

function FilterBar({ filters, availableFilters, onFilterChange, onClearFilters, hasActiveFilters }) {
  const [showSkills, setShowSkills] = useState(false);
  const [showIndustries, setShowIndustries] = useState(false);

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleSkillToggle = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFilterChange({ ...filters, skills: newSkills });
  };

  const handleIndustryToggle = (industry) => {
    const newIndustries = filters.industries.includes(industry)
      ? filters.industries.filter(i => i !== industry)
      : [...filters.industries, industry];
    onFilterChange({ ...filters, industries: newIndustries });
  };

  const handleOpenToWorkToggle = () => {
    onFilterChange({ ...filters, openToWork: !filters.openToWork });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__main">
        <input
          type="text"
          placeholder="Search People"
          value={filters.search}
          onChange={handleSearchChange}
          className="filter-bar__search"
        />

        <div className="filter-bar__buttons">
          <button
            className={`btn ${showSkills ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setShowSkills(!showSkills)}
          >
            Skills {filters.skills.length > 0 && `(${filters.skills.length})`}
          </button>

          <button
            className={`btn ${showIndustries ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setShowIndustries(!showIndustries)}
          >
            Industries {filters.industries.length > 0 && `(${filters.industries.length})`}
          </button>

          <button
            className={`btn ${filters.openToWork ? 'btn--primary' : 'btn--outline'}`}
            onClick={handleOpenToWorkToggle}
          >
            Open to Work
          </button>

          {hasActiveFilters && (
            <button
              className="btn btn--secondary"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {showSkills && availableFilters.skills.length > 0 && (
        <div className="filter-bar__dropdown">
          <h4 className="filter-bar__dropdown-title">Select Skills</h4>
          <div className="filter-bar__options">
            {availableFilters.skills.map(skill => (
              <label key={skill} className="filter-bar__checkbox">
                <input
                  type="checkbox"
                  checked={filters.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {showIndustries && availableFilters.industries.length > 0 && (
        <div className="filter-bar__dropdown">
          <h4 className="filter-bar__dropdown-title">Select Industries</h4>
          <div className="filter-bar__options">
            {availableFilters.industries.map(industry => (
              <label key={industry} className="filter-bar__checkbox">
                <input
                  type="checkbox"
                  checked={filters.industries.includes(industry)}
                  onChange={() => handleIndustryToggle(industry)}
                />
                <span>{industry}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {filters.skills.length > 0 && (
        <div className="filter-bar__active">
          <span className="text-muted text-small">Active Skills:</span>
          {filters.skills.map(skill => (
            <span key={skill} className="badge badge--primary" style={{ cursor: 'pointer' }} onClick={() => handleSkillToggle(skill)}>
              {skill} ×
            </span>
          ))}
        </div>
      )}

      {filters.industries.length > 0 && (
        <div className="filter-bar__active">
          <span className="text-muted text-small">Active Industries:</span>
          {filters.industries.map(industry => (
            <span key={industry} className="badge badge--secondary" style={{ cursor: 'pointer' }} onClick={() => handleIndustryToggle(industry)}>
              {industry} ×
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterBar;


