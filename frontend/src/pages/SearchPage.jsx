import { useState } from 'react';
import { searchAPI } from '../utils/api';
import PersonCard from '../components/PersonCard';
import ProjectCard from '../components/ProjectCard';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ people: [], projects: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchAPI.search({ q: query, type: 'all' });
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearch} className="mt-lg">
        <div className="flex gap-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people and projects..."
            className="search-input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn--primary">Search</button>
        </div>
      </form>

      {loading && <div className="loading mt-xl">Searching...</div>}

      {!loading && (results.people.length > 0 || results.projects.length > 0) && (
        <div className="mt-xl">
          {results.people.length > 0 && (
            <div className="mb-xl">
              <h2>People ({results.people.length})</h2>
              <div className="grid grid--3 mt-md">
                {results.people.map(person => (
                  <PersonCard key={person.slug} person={person} />
                ))}
              </div>
            </div>
          )}

          {results.projects.length > 0 && (
            <div>
              <h2>Projects ({results.projects.length})</h2>
              <div className="grid grid--3 mt-md">
                {results.projects.map(project => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;


