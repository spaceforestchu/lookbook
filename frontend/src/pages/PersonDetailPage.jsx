import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { profilesAPI, projectsAPI } from '../utils/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Globe, Camera, Code, Rocket, Zap, Lightbulb, Target, Square, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';

function PersonDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [person, setPerson] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [viewMode, setViewMode] = useState('people'); // 'people' or 'projects'
  const [layoutView, setLayoutView] = useState('detail'); // 'detail' or 'grid'
  const [gridPage, setGridPage] = useState(0); // For grid pagination
  
  // Detect viewMode from URL
  useEffect(() => {
    if (location.pathname.startsWith('/projects')) {
      setViewMode('projects');
      setFilterView('projects');
    } else {
      setViewMode('people');
      setFilterView('people');
    }
  }, [location.pathname]);
  
  // Sidebar state
  const [filterView, setFilterView] = useState('people');
  
  // Filter state
  const [peopleFilters, setPeopleFilters] = useState({
    search: '',
    skills: [],
    industries: [],
    openToWork: false
  });
  const [availablePeopleFilters, setAvailablePeopleFilters] = useState({
    skills: [],
    industries: []
  });
  
  const [projectFilters, setProjectFilters] = useState({
    search: '',
    skills: [],
    sectors: []
  });
  const [availableProjectFilters, setAvailableProjectFilters] = useState({
    skills: [],
    sectors: []
  });

  // Fetch all profiles for navigation
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const data = await profilesAPI.getAll({ limit: 100 });
        if (data.success) {
          setAllProfiles(data.data);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    };
    fetchAllProfiles();
  }, []);

  // Fetch all projects for navigation
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const data = await projectsAPI.getAll({ limit: 100 });
        if (data.success) {
          setAllProjects(data.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (viewMode === 'people' && allProfiles.length > 0) {
      const fetchPerson = async () => {
        setLoading(true);
        try {
          const data = await profilesAPI.getBySlug(slug);
          if (data.success) {
            setPerson(data.data);
            // Find current index in all profiles
            const index = allProfiles.findIndex(p => p.slug === slug);
            setCurrentIndex(index);
          }
        } catch (err) {
          setError('Profile not found');
        } finally {
          setLoading(false);
        }
      };
      fetchPerson();
    } else if (viewMode === 'projects' && allProjects.length > 0) {
      // Fetch the current project by slug
      const fetchProject = async () => {
        setLoading(true);
        try {
          const data = await projectsAPI.getBySlug(slug);
          if (data.success) {
            setProject(data.data);
            // Find current index in all projects
            const index = allProjects.findIndex(p => p.slug === slug);
            setCurrentIndex(index);
          }
        } catch (err) {
          setError('Project not found');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
    
    const fetchFilters = async () => {
      try {
        const peopleFiltersData = await profilesAPI.getFilters();
        if (peopleFiltersData.success) {
          setAvailablePeopleFilters(peopleFiltersData.data);
        }
        
        const projectFiltersData = await projectsAPI.getFilters();
        if (projectFiltersData.success) {
          setAvailableProjectFilters(projectFiltersData.data);
        }
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, [slug, allProfiles, viewMode, allProjects]);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      if (viewMode === 'people') {
        const prevProfile = allProfiles[currentIndex - 1];
        navigate(`/people/${prevProfile.slug}`);
      } else {
        const prevProject = allProjects[currentIndex - 1];
        navigate(`/projects/${prevProject.slug}`);
      }
    }
  };

  const handleNext = () => {
    const maxLength = viewMode === 'people' ? allProfiles.length : allProjects.length;
    if (currentIndex < maxLength - 1) {
      if (viewMode === 'people') {
        const nextProfile = allProfiles[currentIndex + 1];
        navigate(`/people/${nextProfile.slug}`);
      } else {
        const nextProject = allProjects[currentIndex + 1];
        navigate(`/projects/${nextProject.slug}`);
      }
    }
  };

  const handleTabSwitch = (tab) => {
    setFilterView(tab);
    setViewMode(tab);
    setCurrentIndex(-1);
    if (tab === 'people' && allProfiles.length > 0) {
      navigate(`/people/${allProfiles[0].slug}`);
    } else if (tab === 'projects' && allProjects.length > 0) {
      navigate(`/projects/${allProjects[0].slug}`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        // In grid view, navigate between pages
        if (layoutView === 'grid' && viewMode === 'projects') {
          if (gridPage > 0) {
            setGridPage(gridPage - 1);
          }
        } else {
          // In detail view, navigate between items
          handlePrevious();
        }
      } else if (e.key === 'ArrowRight') {
        // In grid view, navigate between pages
        if (layoutView === 'grid' && viewMode === 'projects') {
          if (gridPage < Math.ceil(allProjects.length / 8) - 1) {
            setGridPage(gridPage + 1);
          }
        } else {
          // In detail view, navigate between items
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, viewMode, allProfiles, allProjects, layoutView, gridPage]);

  const canGoPrevious = currentIndex > 0;
  const currentLength = viewMode === 'people' ? allProfiles.length : allProjects.length;
  const canGoNext = currentIndex >= 0 && currentIndex < currentLength - 1;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!person && !project) return <div className="flex items-center justify-center min-h-screen">Not found</div>;

  const initials = person?.name?.split(' ').map(n => n.charAt(0)).join('') || project?.title?.charAt(0) || '?';

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#e3e3e3'}}>
      {/* Logo - Top Left - Fixed */}
      <div className="fixed left-4 top-4 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: '#4242ea'}}>
            L
          </div>
          <span className="font-semibold text-base">Lookbook</span>
        </div>
      </div>

      {/* Search Bar and View Icons - Scrolls with content */}
      <div className="absolute top-4 z-40" style={{left: '272px', right: '1rem'}}>
        <div className="max-w-7xl mx-auto flex justify-between items-end gap-3">
          {/* Page indicator */}
          {layoutView === 'grid' && viewMode === 'projects' && allProjects.length > 0 && (
            <div className="text-base font-semibold text-gray-700">
              Page {gridPage + 1} of {Math.ceil(allProjects.length / 8)}
            </div>
          )}
          {layoutView === 'detail' && currentLength > 0 && currentIndex >= 0 && (
            <div className="text-base font-semibold text-gray-700">
              {currentIndex + 1} of {currentLength}
            </div>
          )}
          
          <div className="flex items-center gap-3">
          <Input
            placeholder="Search"
            value={peopleFilters.search}
            onChange={(e) => setPeopleFilters({ ...peopleFilters, search: e.target.value })}
            className="w-64 bg-white"
          />
          {/* View Toggle Icons */}
          <div className="flex items-center gap-2 bg-white rounded-md border p-1">
            <button 
              className="p-2 rounded" 
              style={{backgroundColor: layoutView === 'detail' ? '#4242ea' : 'transparent', color: layoutView === 'detail' ? 'white' : 'black'}}
              onClick={() => setLayoutView('detail')}
            >
              <Square className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded hover:bg-gray-100"
              style={{backgroundColor: layoutView === 'grid' ? '#4242ea' : 'transparent', color: layoutView === 'grid' ? 'white' : 'black'}}
              onClick={() => setLayoutView('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <List className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Floating */}
      <div className="fixed left-4 top-20 z-50">
        <aside className="w-60 rounded-xl overflow-y-auto border-2 border-white" style={{backgroundColor: '#e3e3e3', maxHeight: 'calc(100vh - 10rem)'}}>
          <div className="flex flex-col h-full">

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Tabs */}
              <div className="flex gap-1 border-b">
                <button
                  className={`flex-1 py-2 text-sm transition-colors ${
                    filterView === 'people' 
                      ? 'border-b-2 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700 font-medium'
                  }`}
                  style={filterView === 'people' ? {color: '#4242ea', borderColor: '#4242ea'} : {}}
                  onClick={() => handleTabSwitch('people')}
                >
                  PEOPLE
                </button>
                <button
                  className={`flex-1 py-2 text-sm transition-colors ${
                    filterView === 'projects' 
                      ? 'border-b-2 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700 font-medium'
                  }`}
                  style={filterView === 'projects' ? {color: '#4242ea', borderColor: '#4242ea'} : {}}
                  onClick={() => handleTabSwitch('projects')}
                >
                  PROJECTS
                </button>
              </div>

              {/* People Filters */}
              {filterView === 'people' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Skills</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availablePeopleFilters.skills.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={peopleFilters.skills.includes(skill)}
                            onCheckedChange={(checked) => {
                              setPeopleFilters({
                                ...peopleFilters,
                                skills: checked
                                  ? [...peopleFilters.skills, skill]
                                  : peopleFilters.skills.filter(s => s !== skill)
                              });
                            }}
                          />
                          <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white" />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Industries</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availablePeopleFilters.industries.map(industry => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={peopleFilters.industries.includes(industry)}
                            onCheckedChange={(checked) => {
                              setPeopleFilters({
                                ...peopleFilters,
                                industries: checked
                                  ? [...peopleFilters.industries, industry]
                                  : peopleFilters.industries.filter(i => i !== industry)
                              });
                            }}
                          />
                          <label htmlFor={`industry-${industry}`} className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white" />

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has-demo-video" />
                      <label htmlFor="has-demo-video" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        Has Demo Video
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="open-to-relocate" />
                      <label htmlFor="open-to-relocate" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        Open to Relocate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="open-to-work" />
                      <label htmlFor="open-to-work" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        Open to Work
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="freelance" />
                      <label htmlFor="freelance" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        Freelance
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nyc-based" />
                      <label htmlFor="nyc-based" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        NYC-based
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remote-only" />
                      <label htmlFor="remote-only" className="text-sm cursor-pointer" style={{fontWeight: 400}}>
                        Remote Only
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Filters */}
              {filterView === 'projects' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Technologies</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableProjectFilters.skills.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`proj-skill-${skill}`}
                            checked={projectFilters.skills.includes(skill)}
                            onCheckedChange={(checked) => {
                              setProjectFilters({
                                ...projectFilters,
                                skills: checked
                                  ? [...projectFilters.skills, skill]
                                  : projectFilters.skills.filter(s => s !== skill)
                              });
                            }}
                          />
                          <Label htmlFor={`proj-skill-${skill}`} className="text-sm cursor-pointer">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Industries</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableProjectFilters.sectors.map(sector => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`proj-sector-${sector}`}
                            checked={projectFilters.sectors.includes(sector)}
                            onCheckedChange={(checked) => {
                              setProjectFilters({
                                ...projectFilters,
                                sectors: checked
                                  ? [...projectFilters.sectors, sector]
                                  : projectFilters.sectors.filter(s => s !== sector)
                              });
                            }}
                          />
                          <Label htmlFor={`proj-sector-${sector}`} className="text-sm cursor-pointer">
                            {sector}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </aside>

        {/* Footer under sidebar */}
        <div className="w-60 text-center text-xs text-gray-600 mt-2">
          Built with ♥ by Pursuit + AI
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-20" style={{marginLeft: '264px', marginRight: '48px'}}>
        <div className="max-w-7xl mx-auto relative">
          
          {/* Grid View */}
          {layoutView === 'grid' && viewMode === 'projects' && (
            <>
              {/* Grid Navigation Arrows */}
              <div className="sticky top-1/2 -translate-y-1/2 left-0 right-0 h-0 pointer-events-none z-50">
                <button
                  onClick={() => setGridPage(Math.max(0, gridPage - 1))}
                  disabled={gridPage === 0}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{left: '-80px'}}
                  aria-label="Previous page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Previous</span>
                </button>

                <button
                  onClick={() => setGridPage(Math.min(Math.ceil(allProjects.length / 8) - 1, gridPage + 1))}
                  disabled={gridPage >= Math.ceil(allProjects.length / 8) - 1}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{right: '-80px'}}
                  aria-label="Next page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Next</span>
                </button>
              </div>

              <div className="grid grid-cols-4 grid-rows-2 gap-6" style={{
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
              <style>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}</style>
              {allProjects.slice(gridPage * 8, (gridPage + 1) * 8).map((proj, idx) => (
                <Card 
                  key={proj.slug} 
                  className="rounded-xl border-0 shadow-none cursor-pointer hover:shadow-lg transition-all overflow-hidden relative"
                  style={{backgroundColor: 'white', height: '380px'}}
                  onClick={() => {
                    setLayoutView('detail');
                    navigate(`/projects/${proj.slug}`);
                  }}
                >
                  {/* Background Image */}
                  {proj.main_image_url && (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={(() => {
                          try {
                            const images = JSON.parse(proj.main_image_url);
                            if (Array.isArray(images)) {
                              return typeof images[0] === 'string' ? images[0] : images[0].url;
                            }
                          } catch {}
                          return proj.main_image_url;
                        })()}
                        alt={proj.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                    </div>
                  )}
                  
                  <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Top Section - Title and Description */}
                    <div>
                      <h3 className="font-bold text-white uppercase mb-3" style={{fontFamily: "'Galano Grotesque', sans-serif", fontSize: '1.5rem'}}>{proj.title}</h3>
                      {proj.short_description && (
                        <p className="text-white leading-snug mb-2" style={{fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>{proj.short_description}</p>
                      )}
                    </div>
                    
                    {/* Bottom Section - Team and Category */}
                    <div>
                      {/* Project Team */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2" style={{fontSize: '14px'}}>Project Team</h4>
                        <div className="space-y-1">
                          {proj.participants && proj.participants.slice(0, 4).map((participant, i) => (
                            <div key={i} className="text-white" style={{fontSize: '14px'}}>
                              • {participant.name || participant}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Category Badge and Arrow */}
                      <div className="flex items-center justify-between">
                        {proj.sectors && proj.sectors.length > 0 ? (
                          <div className="bg-white/90 rounded-full px-4 py-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{color: '#4242ea'}}>
                              {proj.sectors[0]}
                            </span>
                          </div>
                        ) : proj.skills && proj.skills.length > 0 ? (
                          <div className="bg-white/90 rounded-full px-4 py-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{color: '#4242ea'}}>
                              {proj.skills[0]}
                            </span>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        
                        {/* Arrow Button */}
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </>
          )}

          {/* Detail View */}
          {layoutView === 'detail' && (
            <>
          {/* Navigation Arrows - fixed vertically, positioned relative to card horizontally */}
          <div className="sticky top-1/2 -translate-y-1/2 left-0 right-0 h-0 pointer-events-none z-50">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
              style={{left: '-80px'}}
              aria-label="Previous profile"
            >
              <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                <ChevronLeft className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-500">Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
              style={{right: '-80px'}}
              aria-label="Next profile"
            >
              <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-500">Next</span>
            </button>
          </div>

          <Card className="rounded-xl border-2 border-white shadow-none" style={{
            backgroundColor: 'white', 
            minHeight: '800px',
            animation: 'fadeIn 0.3s ease-in-out',
          }}>
            <CardContent className="p-6">
              {/* Render Person or Project based on viewMode */}
              {viewMode === 'people' && person && (
              <>
              {/* Header with Photo and Name */}
              <div className="flex items-start gap-6 mb-6">
                {/* Profile Photo Card and Highlights */}
                <div className="flex-shrink-0 w-60">
                  <div className="rounded-lg overflow-hidden mb-4" style={{height: '270px'}}>
                    {(person.photo_url || person.photoUrl) ? (
                      <img 
                        src={person.photo_url || person.photoUrl} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-6xl">
                        {initials}
                      </div>
                    )}
                  </div>
                  
                  {/* Highlights */}
                  {person.highlights && person.highlights.length > 0 && (
                    <Card className="bg-black border-black">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-sm mb-3 text-white">Highlights</h3>
                        <div className="space-y-3">
                          {person.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                ✓
                              </div>
                              <p className="text-base text-white leading-snug" style={{fontSize: '14px'}}>{highlight}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Name and Info */}
                <div className="flex-1 pt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-bold uppercase tracking-tight mb-2" style={{fontFamily: "'Galano Grotesque', sans-serif", fontSize: '2rem'}}>{person.name}</h1>
                    </div>
                    <div className="flex gap-2">
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {person.x_url && (
                        <a href={person.x_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </Button>
                        </a>
                      )}
                      {person.website_url && (
                        <a href={person.website_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Bio & Credentials */}
                  {person.bio && (
                    <div className="mb-4 pb-4 border-b">
                      <h2 className="text-lg font-bold mb-2">Bio & Credentials</h2>
                      <p className="text-gray-700 leading-snug" style={{fontSize: '16px'}}>{person.bio}</p>
                    </div>
                  )}

                  {/* Select Projects - Before Experience Section */}
                  {person.projects && person.projects.length > 0 && (
                    <div className="mb-4 pb-4 border-b">
                      <h3 className="text-lg font-bold mb-1">Select Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
                        {person.projects.map((project, idx) => {
                          // Cycle through different icons for variety
                          const icons = [Camera, Code, Rocket, Zap, Lightbulb, Target];
                          const Icon = icons[idx % icons.length];
                          
                          return (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white flex-shrink-0">
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-base mb-1">{project.title}</h4>
                                {(project.short_description || project.summary) && (
                                  <p className="text-gray-600 leading-snug mb-2" style={{fontSize: '16px'}}>{project.short_description || project.summary}</p>
                                )}
                                <a href="#" className="text-sm inline-flex items-center gap-1" style={{color: '#4242ea'}}>
                                  Learn More →
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Three Column Layout - Experience, Skills, Industry Expertise */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-2">
                    {/* Experience + Education */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Experience + Education</h3>
                      {person.experience && person.experience.length > 0 ? (
                        <div className="space-y-3">
                          {person.experience.map((exp, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center flex-shrink-0 font-bold text-lg" style={{color: '#4242ea'}}>
                                {exp.org?.charAt(0) || '📄'}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold" style={{fontSize: '16px'}}>{exp.role}</div>
                                <div className="text-gray-600" style={{fontSize: '16px'}}>{exp.org}</div>
                                {(exp.dateFrom || exp.dateTo) && (
                                  <div className="text-gray-500 mt-0.5" style={{fontSize: '16px'}}>
                                    {exp.dateFrom} - {exp.dateTo || 'Present'}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-base">No experience listed</p>
                      )}
                    </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Skills</h3>
                      {person.skills && person.skills.length > 0 ? (
                        <ul className={`space-y-1 ${person.skills.length > 7 ? 'grid grid-cols-2 gap-x-4' : ''}`}>
                          {person.skills.slice(0, 14).map((skill, idx) => (
                            <li key={idx} className="text-gray-700" style={{fontSize: '14px'}}>
                              • {skill}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-base">No skills listed</p>
                      )}
                    </div>

                  {/* Industry Expertise */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Industry Expertise</h3>
                      {person.industry_expertise && person.industry_expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {person.industry_expertise.map((industry, idx) => (
                            <Badge key={idx} className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-3 font-bold uppercase">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-base">No industry expertise listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}

              {/* Project View */}
              {viewMode === 'projects' && project && (
              <>
              <div className="mb-6">
                {/* Project Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-bold uppercase tracking-tight mb-2" style={{fontFamily: "'Galano Grotesque', sans-serif", fontSize: '2rem'}}>{project.title}</h1>
                    </div>
                    <div className="flex gap-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </Button>
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Summary */}
                  {project.summary && (
                    <div className="mb-6 pb-6 border-b">
                      <h2 className="text-lg font-bold mb-2">About</h2>
                      <div style={{maxWidth: '75%'}}>
                        {project.summary.split('\n').filter(para => para.trim()).map((paragraph, idx) => (
                          <p key={idx} className="text-gray-700 leading-snug mb-4" style={{fontSize: '16px'}}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Two Column Layout - Skills and Team */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-2">
                    {/* Skills */}
                    <div>
                      <h3 className="text-base font-bold mb-3">Technologies</h3>
                      {project.skills && project.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill, idx) => (
                            <Badge key={idx} className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-base">No technologies listed</p>
                      )}
                    </div>

                    {/* Team */}
                    <div>
                      <h3 className="text-base font-bold mb-3">Team</h3>
                      {project.participants && project.participants.length > 0 ? (
                        <div className="space-y-2">
                          {project.participants.map((participant, idx) => (
                                     <div key={idx} className="flex items-center gap-2 text-gray-700" style={{fontSize: '16px'}}>
                                       <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                {participant.photoUrl ? (
                                  <img 
                                    src={participant.photoUrl} 
                                    alt={participant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {participant.name?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                              {participant.slug ? (
                                <button 
                                  onClick={() => {
                                    setViewMode('people');
                                    setFilterView('people');
                                    navigate(`/people/${participant.slug}`);
                                  }}
                                  className="hover:underline cursor-pointer"
                                  style={{color: '#4242ea'}}
                                >
                                  {participant.name || participant}
                                </button>
                              ) : (
                                <span>{participant.name || participant}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-base">No team members listed</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Screenshot Section */}
                {project.main_image_url && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold mb-3">Screenshot{(() => {
                      try {
                        const images = JSON.parse(project.main_image_url);
                        return Array.isArray(images) && images.length > 1 ? 's' : '';
                      } catch {
                        return '';
                      }
                    })()}</h3>
                    <div className="space-y-6">
                      {(() => {
                        try {
                          // Try to parse as JSON array
                          const images = JSON.parse(project.main_image_url);
                          if (Array.isArray(images)) {
                            return images.map((image, idx) => (
                              <div key={idx}>
                                <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                                  <img 
                                    src={typeof image === 'string' ? image : image.url}
                                    alt={`${project.title} screenshot ${idx + 1}`}
                                    className="w-full h-auto"
                                  />
                                </div>
                                {typeof image === 'object' && image.description && (
                                  <p className="mt-12 mb-12 text-gray-700 leading-relaxed" style={{fontSize: '16px', maxWidth: '75%'}}>{image.description}</p>
                                )}
                              </div>
                            ));
                          }
                        } catch {
                          // If not JSON, treat as single URL
                        }
                        // Single image
                        return (
                          <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                            <img 
                              src={project.main_image_url} 
                              alt={`${project.title} screenshot`}
                              className="w-full h-auto"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {/* Demo Video if available */}
                {project.demo_video_url && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold mb-3">Demo Video{(() => {
                      try {
                        const videos = JSON.parse(project.demo_video_url);
                        return Array.isArray(videos) && videos.length > 1 ? 's' : '';
                      } catch {
                        return '';
                      }
                    })()}</h3>
                    <div className="space-y-6">
                      {(() => {
                        try {
                          // Try to parse as JSON array
                          const videos = JSON.parse(project.demo_video_url);
                          if (Array.isArray(videos)) {
                            return videos.map((video, idx) => (
                              <div key={idx}>
                                <div className="rounded-lg overflow-hidden border-2 border-gray-200" style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                                  <iframe
                                    src={typeof video === 'string' ? video : video.url}
                                    title={`Demo Video ${idx + 1}`}
                                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                {typeof video === 'object' && video.description && (
                                  <p className="mt-12 mb-12 text-gray-700 leading-snug" style={{fontSize: '16px', maxWidth: '75%'}}>{video.description}</p>
                                )}
                                {typeof video === 'object' && video.screenshot_after && (
                                  <div className="mt-6 rounded-lg overflow-hidden border-2 border-gray-200">
                                    <img 
                                      src={video.screenshot_after}
                                      alt={`${project.title} screenshot`}
                                      className="w-full h-auto"
                                    />
                                  </div>
                                )}
                              </div>
                            ));
                          }
                        } catch {
                          // If not JSON, treat as single URL
                        }
                        // Single video
                        return (
                          <div className="rounded-lg overflow-hidden border-2 border-gray-200" style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                            <iframe
                              src={project.demo_video_url}
                              title="Demo Video"
                              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              </>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonDetailPage;
