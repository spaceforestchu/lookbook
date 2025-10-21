import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
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

  useEffect(() => {
    const fetchPerson = async () => {
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
  }, [slug, allProfiles]);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevProfile = allProfiles[currentIndex - 1];
      navigate(`/people/${prevProfile.slug}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allProfiles.length - 1) {
      const nextProfile = allProfiles[currentIndex + 1];
      navigate(`/people/${nextProfile.slug}`);
    }
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < allProfiles.length - 1;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!person) return <div className="flex items-center justify-center min-h-screen">Profile not found</div>;

  const initials = person.name?.split(' ').map(n => n.charAt(0)).join('') || '?';

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#e3e3e3'}}>
      {/* Logo - Top Left */}
      <div className="fixed left-4 top-4 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: '#4242ea'}}>
            L
          </div>
          <span className="font-semibold text-base">Lookbook</span>
        </div>
      </div>

      {/* Search Bar and View Icons - Aligned with Card Right Edge */}
      <div className="fixed top-4 z-50" style={{left: '272px', right: '1rem'}}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          {/* Page indicator */}
          {allProfiles.length > 0 && currentIndex >= 0 && (
            <div className="text-sm font-semibold text-gray-700">
              {currentIndex + 1} of {allProfiles.length}
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
            <button className="p-2 rounded text-white" style={{backgroundColor: '#4242ea'}}>
              <Square className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
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
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    filterView === 'people' 
                      ? 'border-b-2' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={filterView === 'people' ? {color: '#4242ea', borderColor: '#4242ea'} : {}}
                  onClick={() => setFilterView('people')}
                >
                  People
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    filterView === 'projects' 
                      ? 'border-b-2' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={filterView === 'projects' ? {color: '#4242ea', borderColor: '#4242ea'} : {}}
                  onClick={() => setFilterView('projects')}
                >
                  Projects
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
                  <Input
                    placeholder="Search projects..."
                    value={projectFilters.search}
                    onChange={(e) => setProjectFilters({ ...projectFilters, search: e.target.value })}
                  />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Skills</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableProjectFilters.skills.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox id={`proj-skill-${skill}`} />
                          <Label htmlFor={`proj-skill-${skill}`} className="text-sm cursor-pointer">
                            {skill}
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
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{backgroundColor: '#4242ea'}}
            aria-label="Previous profile"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 rounded-full p-3 shadow-lg transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{backgroundColor: '#4242ea'}}
            aria-label="Next profile"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <Card className="rounded-xl border-2 border-white shadow-none" style={{backgroundColor: 'white', minHeight: '800px'}}>
            <CardContent className="p-6">
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
                              <p className="text-sm text-white leading-snug">{highlight}</p>
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
                      <p className="text-gray-700 text-base leading-snug">{person.bio}</p>
                    </div>
                  )}

                  {/* Select Projects - Before Experience Section */}
                  {person.projects && person.projects.length > 0 && (
                    <div className="mb-4 pb-4 border-b">
                      <h3 className="text-base font-bold mb-1">Select Projects</h3>
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
                                {project.summary && (
                                  <p className="text-base text-gray-600 leading-snug mb-2">{project.summary}</p>
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
                      <h3 className="text-base font-bold mb-3">Experience + Education</h3>
                      {person.experience && person.experience.length > 0 ? (
                        <div className="space-y-3">
                          {person.experience.map((exp, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center flex-shrink-0 font-bold text-lg" style={{color: '#4242ea'}}>
                                {exp.org?.charAt(0) || '📄'}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-base">{exp.role}</div>
                                <div className="text-base text-gray-600">{exp.org}</div>
                                {(exp.dateFrom || exp.dateTo) && (
                                  <div className="text-base text-gray-500 mt-0.5">
                                    {exp.dateFrom} - {exp.dateTo || 'Present'}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No experience listed</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-base font-bold mb-3">Skills</h3>
                      {person.skills && person.skills.length > 0 ? (
                        <ul className={`space-y-1 ${person.skills.length > 7 ? 'grid grid-cols-2 gap-x-4' : ''}`}>
                          {person.skills.slice(0, 14).map((skill, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {skill}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                      )}
                    </div>

                    {/* Industry Expertise */}
                    <div>
                      <h3 className="text-base font-bold mb-3">Industry Expertise</h3>
                      {person.industry_expertise && person.industry_expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {person.industry_expertise.map((industry, idx) => (
                            <Badge key={idx} className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-3 font-bold uppercase">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No industry expertise listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PersonDetailPage;
