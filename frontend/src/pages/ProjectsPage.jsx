import { useState, useEffect } from 'react';
import { projectsAPI } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    cohort: '',
    skills: [],
    sectors: []
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectsAPI.getAll(filters);
        if (data.success) {
          setProjects(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [filters]);

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <h1>Projects</h1>
        <p className="text-muted">Discover innovative projects and their teams</p>
      </div>

      <div className="projects-page__search">
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
      </div>

      {loading && <div className="loading">Loading projects...</div>}

      {!loading && projects.length === 0 && (
        <div className="empty-state">
          <h3 className="empty-state__title">No projects found</h3>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;


