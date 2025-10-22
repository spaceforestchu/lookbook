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
import { Linkedin, Globe, Camera, Code, Rocket, Zap, Lightbulb, Target, Square, Grid3x3, List, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

// Helper function to adjust color brightness for gradients
const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

// Helper function to format name as "FirstName L."
const formatNameShort = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0);
  return `${firstName} ${lastInitial}.`;
};

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
  const [layoutView, setLayoutView] = useState('grid'); // 'detail' or 'grid' - default to grid
  const [gridPage, setGridPage] = useState(0); // For grid pagination
  const [projectCarouselIndex, setProjectCarouselIndex] = useState(0); // For project carousel
  
  // Detect viewMode from URL - run this first
  useEffect(() => {
    const newViewMode = location.pathname.startsWith('/projects') ? 'projects' : 'people';
    setViewMode(newViewMode);
    setFilterView(newViewMode);
    // Reset error when switching modes
    setError(null);
    setPerson(null);
    setProject(null);
  }, [location.pathname]);
  
  // Sidebar state
  const [filterView, setFilterView] = useState('people');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Filtered data based on search and filters
  const filteredProfiles = allProfiles.filter(profile => {
    // Search filter
    if (peopleFilters.search) {
      const searchLower = peopleFilters.search.toLowerCase();
      const matchesName = profile.name?.toLowerCase().includes(searchLower);
      const matchesBio = profile.bio?.toLowerCase().includes(searchLower);
      const matchesSkills = profile.skills?.some(skill => skill.toLowerCase().includes(searchLower));
      if (!matchesName && !matchesBio && !matchesSkills) return false;
    }
    
    // Skills filter
    if (peopleFilters.skills.length > 0) {
      const hasSkill = peopleFilters.skills.some(filterSkill => 
        profile.skills?.includes(filterSkill)
      );
      if (!hasSkill) return false;
    }
    
    // Industries filter
    if (peopleFilters.industries.length > 0) {
      const hasIndustry = peopleFilters.industries.some(filterIndustry => 
        profile.industry_expertise?.includes(filterIndustry)
      );
      if (!hasIndustry) return false;
    }
    
    // Open to work filter
    if (peopleFilters.openToWork && !profile.open_to_work) {
      return false;
    }
    
    return true;
  });

  const filteredProjects = allProjects.filter(project => {
    // Search filter
    if (projectFilters.search) {
      const searchLower = projectFilters.search.toLowerCase();
      const matchesTitle = project.title?.toLowerCase().includes(searchLower);
      const matchesSummary = project.summary?.toLowerCase().includes(searchLower);
      const matchesDescription = project.short_description?.toLowerCase().includes(searchLower);
      const matchesSkills = project.skills?.some(skill => skill.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesSummary && !matchesDescription && !matchesSkills) return false;
    }
    
    // Skills filter
    if (projectFilters.skills.length > 0) {
      const hasSkill = projectFilters.skills.some(filterSkill => 
        project.skills?.includes(filterSkill)
      );
      if (!hasSkill) return false;
    }
    
    // Sectors filter
    if (projectFilters.sectors.length > 0) {
      const hasSector = projectFilters.sectors.some(filterSector => 
        project.sectors?.includes(filterSector)
      );
      if (!hasSector) return false;
    }
    
    return true;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setGridPage(0);
  }, [peopleFilters, projectFilters]);

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
    // If no slug, default to grid view
    if (!slug) {
      setLayoutView('grid');
      setLoading(false);
      console.log('No slug, setting grid view. ViewMode:', viewMode, 'AllProfiles:', allProfiles.length, 'AllProjects:', allProjects.length);
      return;
    }
    
    // If there's a slug, show detail view
    setLayoutView('detail');
        setLoading(true);
    
    if (viewMode === 'people') {
      const fetchPerson = async () => {
        try {
          const data = await profilesAPI.getBySlug(slug);
          if (data.success) {
            setPerson(data.data);
            setProject(null); // Clear project data
            // Find current index in all profiles (only if profiles are loaded)
            if (allProfiles.length > 0) {
            const index = allProfiles.findIndex(p => p.slug === slug);
            setCurrentIndex(index);
            }
            setError(null);
          } else {
            setError('Person not found');
          }
        } catch (err) {
          console.error('Error fetching person:', err);
          setError('Person not found');
        } finally {
          setLoading(false);
        }
      };
      fetchPerson();
    } else if (viewMode === 'projects') {
      // Fetch the current project by slug
      const fetchProject = async () => {
        try {
          const data = await projectsAPI.getBySlug(slug);
          if (data.success) {
            setProject(data.data);
            setPerson(null); // Clear person data
            // Find current index in all projects (only if projects are loaded)
            if (allProjects.length > 0) {
            const index = allProjects.findIndex(p => p.slug === slug);
            setCurrentIndex(index);
            }
            setError(null);
          } else {
            setError('Project not found');
          }
        } catch (err) {
          console.error('Error fetching project:', err);
          setError('Project not found');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [slug, viewMode]);

  // Fetch filters separately - always run
  useEffect(() => {
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
  }, []); // Run once on mount

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
    setMobileMenuOpen(false); // Close mobile menu when switching tabs
    // Navigate to base route (grid view will be set by useEffect if no slug)
    if (tab === 'people') {
      navigate('/people');
    } else if (tab === 'projects') {
      navigate('/projects');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        // In grid view, navigate between pages
        if (layoutView === 'grid') {
          if (gridPage > 0) {
            setGridPage(gridPage - 1);
          }
        } else {
          // In detail view, navigate between items
          handlePrevious();
        }
      } else if (e.key === 'ArrowRight') {
        // In grid view, navigate between pages
        if (layoutView === 'grid') {
          const maxPage = viewMode === 'people' 
            ? Math.ceil(filteredProfiles.length / 8) - 1 
            : Math.ceil(filteredProjects.length / 8) - 1;
          if (gridPage < maxPage) {
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
  if (error && slug) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!person && !project && slug && layoutView === 'detail') return <div className="flex items-center justify-center min-h-screen">Not found</div>;

  const initials = person?.name?.split(' ').map(n => n.charAt(0)).join('') || project?.title?.charAt(0) || '?';

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#e3e3e3'}}>
      {/* Logo - Top Left - Fixed */}
      <div className="fixed left-2 md:left-4 top-2 md:top-4 z-50">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <img 
            src="/pursuit-wordmark.png" 
            alt="Pursuit" 
            className="h-6 md:h-8"
          />
          <span className="font-semibold text-sm md:text-base hidden sm:inline">Lookbook</span>
        </a>
      </div>

      {/* Mobile Menu Button - Top Right - Fixed */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="sm:hidden fixed right-2 top-2 z-50 bg-white rounded-lg p-2 shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Search Bar and View Icons - Scrolls with content */}
      <div className="absolute top-2 md:top-4 z-40 left-2 right-14 sm:right-2 sm:left-[280px] lg:left-[272px] md:right-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-3">
          {/* Page indicator */}
          {layoutView === 'grid' && (
            <div className="text-sm md:text-base font-semibold text-gray-700 hidden sm:block">
              Page {gridPage + 1} of {Math.ceil((viewMode === 'people' ? filteredProfiles.length : filteredProjects.length) / 8)}
            </div>
          )}
          {layoutView === 'detail' && currentLength > 0 && currentIndex >= 0 && (
            <div className="text-sm md:text-base font-semibold text-gray-700 hidden sm:block">
              {currentIndex + 1} of {currentLength}
            </div>
          )}
          {layoutView === 'list' && (
            <div className="text-sm md:text-base font-semibold text-gray-700 hidden sm:block">
              {viewMode === 'people' ? filteredProfiles.length : filteredProjects.length} {viewMode === 'people' ? 'People' : 'Projects'}
            </div>
          )}
          
          <div className="flex items-center gap-2 sm:gap-3 ml-auto w-full sm:w-auto justify-end">
          {layoutView === 'grid' && (
          <Input
              placeholder={viewMode === 'people' ? 'Search People' : 'Search Projects'}
              value={viewMode === 'people' ? peopleFilters.search : projectFilters.search}
              onChange={(e) => {
                if (viewMode === 'people') {
                  setPeopleFilters({ ...peopleFilters, search: e.target.value });
                } else {
                  setProjectFilters({ ...projectFilters, search: e.target.value });
                }
              }}
            className="w-32 sm:w-48 md:w-64 bg-white text-sm"
          />
          )}
          {/* View Toggle Icons */}
          <div className="flex items-center gap-1 bg-white rounded-md border p-1">
            <button 
              className="p-1.5 md:p-2 rounded hover:bg-gray-100"
              style={{backgroundColor: layoutView === 'grid' ? '#4242ea' : 'transparent', color: layoutView === 'grid' ? 'white' : 'black'}}
              onClick={() => {
                setLayoutView('grid');
                // Navigate to base route when switching to grid view
                if (viewMode === 'people') {
                  navigate('/people');
                } else {
                  navigate('/projects');
                }
              }}
            >
              <Grid3x3 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              className="p-1.5 md:p-2 rounded" 
              style={{backgroundColor: layoutView === 'detail' ? '#4242ea' : 'transparent', color: layoutView === 'detail' ? 'white' : 'black'}}
              onClick={() => {
                // When switching to detail view, navigate to first item if no slug
                if (!slug) {
                  if (viewMode === 'people' && filteredProfiles.length > 0) {
                    navigate(`/people/${filteredProfiles[0].slug}`);
                  } else if (viewMode === 'projects' && filteredProjects.length > 0) {
                    navigate(`/projects/${filteredProjects[0].slug}`);
                  }
                } else {
                  setLayoutView('detail');
                }
              }}
            >
              <Square className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              className="hidden md:inline-flex p-1.5 md:p-2 rounded hover:bg-gray-100"
              style={{backgroundColor: layoutView === 'list' ? '#4242ea' : 'transparent', color: layoutView === 'list' ? 'white' : 'black'}}
              onClick={() => setLayoutView('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Floating - Slides in on mobile, always visible on desktop */}
      <div className={`fixed left-0 sm:left-4 top-0 sm:top-20 z-50 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      } sm:block`}>
        <aside style={{backgroundColor: '#e3e3e3'}} className="w-72 sm:w-60 h-screen sm:h-auto sm:rounded-xl overflow-y-auto border-r-2 sm:border-2 border-white sm:max-h-[calc(100vh-10rem)] pt-14 sm:pt-0">
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
                      {availablePeopleFilters.skills.length > 0 ? (
                        availablePeopleFilters.skills.map(skill => (
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
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">Loading skills...</p>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-white" />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Industries</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availablePeopleFilters.industries.length > 0 ? (
                        availablePeopleFilters.industries.map(industry => (
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
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">Loading industries...</p>
                      )}
                    </div>
                  </div>

                  {/* TEMPORARILY HIDDEN - Additional Filters
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
                  */}
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

                  <Separator className="bg-white" />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Industries</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
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
              
              {/* Contact Section */}
              <Separator className="bg-white" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Contact for Resume / Hiring Interest</p>
                <p className="text-sm">hiring@pursuit.org</p>
              </div>
            </div>
        </div>
      </aside>

        {/* Footer under sidebar */}
        <div className="w-60 text-center text-xs text-gray-600 mt-2">
          Built with ♥ by Pursuit + AI
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-16 sm:mt-20 mx-2 sm:ml-[280px] lg:ml-[344px] lg:mr-12">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Grid View */}
          {layoutView === 'grid' && viewMode === 'projects' && (
            <>
              {/* Grid Navigation Arrows - Hidden on mobile */}
              <div className="hidden md:block sticky top-1/2 -translate-y-1/2 left-0 right-0 h-0 pointer-events-none z-50">
                <button
                  onClick={() => setGridPage(Math.max(0, gridPage - 1))}
                  disabled={gridPage === 0}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{left: '-70px'}}
                  aria-label="Previous page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Previous</span>
                </button>

                <button
                  onClick={() => setGridPage(Math.min(Math.ceil(filteredProjects.length / 8) - 1, gridPage + 1))}
                  disabled={gridPage >= Math.ceil(filteredProjects.length / 8) - 1}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{right: '-70px'}}
                  aria-label="Next page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Next</span>
                </button>
              </div>

              <div 
                key={`projects-grid-${gridPage}-${projectFilters.skills.join(',')}-${projectFilters.sectors.join(',')}-${projectFilters.search}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-6" 
                style={{
                animation: 'fadeIn 0.3s ease-in-out',
                }}
              >
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
              {filteredProjects.slice(gridPage * 8, (gridPage + 1) * 8).map((proj, idx) => (
                <Card 
                  key={proj.slug} 
                  className="rounded-xl border-0 shadow-md cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden relative hover:-translate-y-1"
                  style={{backgroundColor: 'white', height: '380px'}}
                  onClick={() => {
                    setLayoutView('detail');
                    navigate(`/projects/${proj.slug}`);
                  }}
                >
                  {/* Background Image or Color */}
                  {proj.main_image_url ? (
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
                      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0" style={{
                      background: `linear-gradient(135deg, ${proj.background_color || '#6366f1'} 0%, ${adjustColor(proj.background_color || '#6366f1', -30)} 100%)`
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
                      {/* Display icon if available */}
                      {proj.icon_url && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <img 
                            src={proj.icon_url} 
                            alt={`${proj.title} icon`}
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Icon Badge (top-right) */}
                    {proj.icon_url && (
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center">
                        <img 
                          src={proj.icon_url} 
                          alt={`${proj.title} icon`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Top Section - Title and Description */}
                    <div>
                      <h3 className="font-bold text-white uppercase mb-3 leading-tight" style={{fontFamily: "'Galano Grotesque', sans-serif", fontSize: '1.5rem'}}>{proj.title}</h3>
                      {proj.short_description && (
                        <p className="text-white leading-snug mb-2" style={{fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>{proj.short_description}</p>
                      )}
                    </div>
                    
                    {/* Bottom Section - Team and Category */}
                    <div>
                      {/* Project Team */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2" style={{fontSize: '14px'}}>Project Team</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                          {proj.participants && proj.participants.slice(0, 4).map((participant, i) => (
                              <div 
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-semibold"
                                title={participant.name || participant}
                              >
                                {(participant.photo_url || participant.photoUrl) ? (
                                  <img 
                                    src={participant.photo_url || participant.photoUrl}
                                    alt={participant.name || participant}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{(participant.name || participant).split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}</span>
                                )}
                            </div>
                          ))}
                            {proj.participants && proj.participants.length > 4 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                                +{proj.participants.length - 4}
                              </div>
                            )}
                          </div>
                          <p className="text-white text-sm">
                            {proj.participants && proj.participants.map(p => formatNameShort(p.name || p)).join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Category Badge and Arrow */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                        {proj.sectors && proj.sectors.length > 0 ? (
                            proj.sectors.map((sector, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white font-semibold uppercase">
                                {sector}
                            </span>
                            ))
                        ) : proj.skills && proj.skills.length > 0 ? (
                            proj.skills.slice(0, 2).map((skill, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-semibold">
                                {skill}
                            </span>
                            ))
                          ) : null}
                          </div>
                        
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

          {/* People Grid View */}
          {layoutView === 'grid' && viewMode === 'people' && (
            <>
              {/* Grid Navigation Arrows - Hidden on mobile */}
              <div className="hidden md:block sticky top-1/2 -translate-y-1/2 left-0 right-0 h-0 pointer-events-none z-50">
                <button
                  onClick={() => setGridPage(Math.max(0, gridPage - 1))}
                  disabled={gridPage === 0}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{left: '-70px'}}
                  aria-label="Previous page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Previous</span>
                </button>

                <button
                  onClick={() => setGridPage(Math.min(Math.ceil(filteredProfiles.length / 8) - 1, gridPage + 1))}
                  disabled={gridPage >= Math.ceil(filteredProfiles.length / 8) - 1}
                  className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                  style={{right: '-70px'}}
                  aria-label="Next page"
                >
                  <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">Next</span>
                </button>
              </div>

              <div 
                key={`people-grid-${gridPage}-${peopleFilters.skills.join(',')}-${peopleFilters.industries.join(',')}-${peopleFilters.search}-${peopleFilters.openToWork}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-6" 
                style={{
                  animation: 'fadeIn 0.3s ease-in-out',
                }}
              >
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
              {filteredProfiles.slice(gridPage * 8, (gridPage + 1) * 8).map((prof, idx) => (
                <Card 
                  key={prof.slug} 
                  className="rounded-xl border-0 shadow-md cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden relative hover:-translate-y-1"
                  style={{backgroundColor: 'white', height: '380px'}}
                  onClick={() => {
                    setLayoutView('detail');
                    navigate(`/people/${prof.slug}`);
                  }}
                >
                  {/* Background Image */}
                  {(prof.photo_url || prof.photoUrl) && (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={prof.photo_url || prof.photoUrl}
                        alt={prof.name}
                        className="w-full h-full object-cover opacity-90"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
                    </div>
                  )}
                  {!(prof.photo_url || prof.photoUrl) && (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-purple-600"></div>
                  )}
                  
                  <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Top Section - Name and Title Only */}
                    <div>
                      <h3 className="font-bold text-white uppercase mb-2" style={{fontFamily: "'Galano Grotesque', sans-serif", fontSize: '1.5rem'}}>{prof.name}</h3>
                      {prof.title && (
                        <p className="text-white mb-2" style={{fontSize: '14px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>{prof.title}</p>
                      )}
                    </div>
                    
                    {/* Bottom Section - Bio, Skills and Status */}
                    <div>
                      {/* Bio */}
                      {prof.bio && (
                        <p className="text-white leading-snug mb-3 line-clamp-2" style={{fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>{prof.bio}</p>
                      )}
                      
                      {/* Skills */}
                      {prof.skills && prof.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2" style={{fontSize: '14px'}}>Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {prof.skills.slice(0, 5).map((skill, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                {skill}
                              </span>
                            ))}
                            {prof.skills.length > 5 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                +{prof.skills.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Industry Tags and Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {prof.industry_expertise && prof.industry_expertise.slice(0, 2).map((industry, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white font-semibold uppercase">
                              {industry}
                            </span>
                          ))}
                        </div>
                        
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

          {/* List View */}
          {layoutView === 'list' && (
            <Card className="rounded-xl border-2 border-white shadow-none mb-12" style={{
              backgroundColor: 'white',
              animation: 'fadeIn 0.3s ease-in-out',
            }}>
              <CardContent className="p-6">
                {viewMode === 'projects' && (
                  <div>
                    {filteredProjects.map((proj, index) => (
                      <div key={proj.slug}>
                        {index > 0 && <div className="border-t border-gray-200 my-0"></div>}
                        <div 
                          onClick={() => {
                            setLayoutView('detail');
                            navigate(`/projects/${proj.slug}`);
                          }}
                          className="flex items-center gap-6 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                        {/* Project Icon/Image */}
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500">
                          {(proj.icon_url || proj.main_image_url) ? (
                            <img 
                              src={(() => {
                                // Use icon_url if available, otherwise use main_image_url
                                const imageUrl = proj.icon_url || proj.main_image_url;
                                try {
                                  const images = JSON.parse(imageUrl);
                                  if (Array.isArray(images)) {
                                    return typeof images[0] === 'string' ? images[0] : images[0].url;
                                  }
                                } catch {}
                                return imageUrl;
                              })()}
                              alt={proj.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                              {proj.title?.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Project Name and Description */}
                        <div className="flex-1 min-w-0" style={{maxWidth: '550px'}}>
                          <h3 className="font-bold text-lg uppercase" style={{fontFamily: "'Galano Grotesque', sans-serif"}}>
                            {proj.title}
                          </h3>
                          {proj.short_description && (
                            <p className="text-gray-600 mb-2" style={{fontSize: '14px'}}>
                              {proj.short_description}
                            </p>
                          )}
                          {/* Industry Pills */}
                          <div className="flex gap-2 flex-wrap">
                            {proj.sectors && proj.sectors.slice(0, 2).map((sector, i) => (
                              <span 
                                key={i} 
                                className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white font-semibold uppercase"
                              >
                                {sector}
                              </span>
                            ))}
                            {proj.sectors && proj.sectors.length > 2 && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full bg-gray-400 text-white font-semibold"
                              >
                                +{proj.sectors.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Project Team */}
                        <div className="w-48 flex-shrink-0 ml-14">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Project Team</h4>
                          {proj.participants && proj.participants.length > 0 ? (
                            <div className="space-y-2">
                              {proj.participants.slice(0, 3).map((participant, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                    title={participant.name || participant}
                                  >
                                    {(participant.photo_url || participant.photoUrl) ? (
                                      <img 
                                        src={participant.photo_url || participant.photoUrl}
                                        alt={participant.name || participant}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{(participant.name || participant).split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}</span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-700 truncate">{participant.name || participant}</span>
                                </div>
                              ))}
                              {proj.participants.length > 3 && (
                                <div className="text-xs text-gray-500 pl-8">
                                  +{proj.participants.length - 3} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No team listed</p>
                          )}
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                )}
                {viewMode === 'people' && (
                  <div>
                    {filteredProfiles.map((prof, index) => (
                      <div key={prof.slug}>
                        {index > 0 && <div className="border-t border-gray-200 my-0"></div>}
                        <div 
                          onClick={() => {
                            setLayoutView('detail');
                            navigate(`/people/${prof.slug}`);
                          }}
                          className="flex items-start gap-6 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {/* Profile Photo */}
                          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                            {(prof.photo_url || prof.photoUrl) ? (
                              <img 
                                src={prof.photo_url || prof.photoUrl}
                                alt={prof.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                {prof.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                              </div>
                            )}
                          </div>

                          {/* Name and Bio */}
                          <div className="flex-1 min-w-0" style={{maxWidth: '550px'}}>
                            <h3 className="font-bold text-lg uppercase" style={{fontFamily: "'Galano Grotesque', sans-serif"}}>
                              {prof.name}
                            </h3>
                            {prof.title && (
                              <p className="text-sm text-gray-700 mb-1" style={{fontWeight: '500'}}>
                                {prof.title}
                              </p>
                            )}
                            {prof.bio && (
                              <p className="text-gray-600 mb-2 line-clamp-2" style={{fontSize: '14px'}}>
                                {prof.bio}
                              </p>
                            )}
                            {/* Skills/Industries Pills */}
                            <div className="flex gap-2 flex-wrap">
                              {prof.skills && prof.skills.slice(0, 3).map((skill, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-semibold"
                                >
                                  {skill}
                                </span>
                              ))}
                              {prof.skills && prof.skills.length > 3 && (
                                <span 
                                  className="text-xs px-2 py-1 rounded-full bg-gray-400 text-white font-semibold"
                                >
                                  +{prof.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Industries/Status */}
                          <div className="w-48 flex-shrink-0 ml-14">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Industry Expertise</h4>
                            {prof.industry_expertise && prof.industry_expertise.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {prof.industry_expertise.slice(0, 3).map((industry, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white font-semibold uppercase"
                                  >
                                    {industry}
                                  </span>
                                ))}
                                {prof.industry_expertise.length > 3 && (
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full bg-gray-400 text-white font-semibold"
                                  >
                                    +{prof.industry_expertise.length - 3}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No industries listed</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detail View */}
          {layoutView === 'detail' && (
            <>
          {/* Navigation Arrows - fixed vertically, positioned relative to card horizontally - Hidden on mobile */}
          <div className="hidden md:block sticky top-1/2 -translate-y-1/2 left-0 right-0 h-0 pointer-events-none z-50">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="absolute flex flex-col items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
              style={{left: '-70px'}}
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
              style={{right: '-70px'}}
              aria-label="Next profile"
            >
              <div className="rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:hover:scale-100" style={{backgroundColor: '#4242ea'}}>
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-500">Next</span>
            </button>
          </div>

          {/* Mobile Navigation - Bottom Fixed */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-3 flex items-center justify-between shadow-lg">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{backgroundColor: canGoPrevious ? '#4242ea' : '#e5e7eb', color: canGoPrevious ? 'white' : '#9ca3af'}}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold text-sm">Previous</span>
            </button>
            
            <div className="text-sm font-semibold text-gray-700">
              {currentIndex + 1} / {currentLength}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{backgroundColor: canGoNext ? '#4242ea' : '#e5e7eb', color: canGoNext ? 'white' : '#9ca3af'}}
            >
              <span className="font-semibold text-sm">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <Card className="rounded-xl border-2 border-white shadow-none mb-12 md:mb-12" style={{
            backgroundColor: 'white', 
            minHeight: '800px',
            marginBottom: 'calc(3rem + 70px)', // Extra space for mobile nav on mobile
            animation: 'fadeIn 0.3s ease-in-out',
          }}>
            <CardContent className="p-4 md:p-6">
              {/* Render Person or Project based on viewMode */}
              {viewMode === 'people' && person && (
              <>
              {/* Header with Photo and Name */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                {/* Profile Photo Card and Highlights */}
                <div className="flex-shrink-0 w-full md:w-60">
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
                <div className="flex-1 w-full md:w-auto pt-0 md:pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                        <h1 className="font-bold uppercase tracking-tight text-2xl md:text-3xl" style={{fontFamily: "'Galano Grotesque', sans-serif"}}>{person.name}</h1>
                        {person.title && (
                          <p className="text-base md:text-lg text-gray-600">{person.title}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" style={{ backgroundColor: '#0A66C2', color: 'white' }} className="hover:opacity-90">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </Button>
                        </a>
                      )}
                      {person.x_url && (
                        <a href={person.x_url.startsWith('http') ? person.x_url : `https://x.com/${person.x_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" style={{ backgroundColor: '#000000', color: 'white' }} className="hover:opacity-90">
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
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold">Select Projects</h3>
                        {person.projects.length > 3 && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setProjectCarouselIndex(Math.max(0, projectCarouselIndex - 3))}
                              disabled={projectCarouselIndex === 0}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const maxIndex = Math.floor((person.projects.length - 1) / 3) * 3;
                                setProjectCarouselIndex(Math.min(maxIndex, projectCarouselIndex + 3));
                              }}
                              disabled={projectCarouselIndex >= Math.floor((person.projects.length - 1) / 3) * 3}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
                        {person.projects.slice(projectCarouselIndex, projectCarouselIndex + 3).map((project, idx) => {
                          // Cycle through different icons for variety
                          const icons = [Camera, Code, Rocket, Zap, Lightbulb, Target];
                          const Icon = icons[(projectCarouselIndex + idx) % icons.length];
                          
                          // Check if project has an icon_url or main_image_url
                          const hasProjectImage = project.icon_url || project.main_image_url;
                          const imageUrl = project.icon_url || project.main_image_url;
                          
                          return (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                                {hasProjectImage ? (
                                  <img
                                    src={(() => {
                                      try {
                                        const images = JSON.parse(imageUrl);
                                        if (Array.isArray(images)) {
                                          return typeof images[0] === 'string' ? images[0] : images[0].url;
                                        }
                                      } catch {}
                                      return imageUrl;
                                    })()}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                <Icon className="w-6 h-6" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-base mb-1">{project.title}</h4>
                                {(project.short_description || project.summary) && (
                                  <p className="text-gray-600 leading-snug mb-2" style={{fontSize: '16px'}}>{project.short_description || project.summary}</p>
                                )}
                                <button
                                  onClick={() => {
                                    setViewMode('projects');
                                    navigate(`/projects/${project.slug}`);
                                  }}
                                  className="text-sm inline-flex items-center gap-1 hover:underline cursor-pointer"
                                  style={{color: '#4242ea'}}
                                >
                                  Learn More →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Three Column Layout - Experience, Skills, Industry Expertise */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-2">
                    {/* Experience & Education */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Experience & Education</h3>
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
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white font-semibold uppercase">
                              {industry}
                            </span>
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
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                    <div>
                      <h1 className="font-bold uppercase tracking-tight mb-2 text-2xl md:text-3xl" style={{fontFamily: "'Galano Grotesque', sans-serif"}}>{project.title}</h1>
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
                      <div className="md:max-w-[75%]">
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
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-semibold">
                              {skill}
                            </span>
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
                                <div className="rounded-lg overflow-hidden">
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
                          <div className="rounded-lg overflow-hidden">
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
                                <div className="rounded-lg overflow-hidden" style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
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
                                  <div className="mt-6 rounded-lg overflow-hidden">
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
                          <div className="rounded-lg overflow-hidden" style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
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
