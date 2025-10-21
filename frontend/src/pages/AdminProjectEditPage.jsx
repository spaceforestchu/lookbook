import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, profilesAPI } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

function AdminProjectEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allPeople, setAllPeople] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    short_description: '',
    main_image_url: '',
    demo_video_url: '',
    github_url: '',
    live_url: '',
    skills: [],
    sectors: [],
    slug: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [sectorInput, setSectorInput] = useState('');

  useEffect(() => {
    fetchAllPeople();
    if (!isNew) {
      fetchProject();
    }
  }, [slug, isNew]);

  const fetchAllPeople = async () => {
    try {
      const response = await profilesAPI.getAll();
      setAllPeople(response.data || []);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getBySlug(slug);
      const project = response.data;
      
      setFormData({
        title: project.title || '',
        summary: project.summary || '',
        short_description: project.short_description || '',
        main_image_url: project.main_image_url || '',
        demo_video_url: project.demo_video_url || '',
        github_url: project.github_url || '',
        live_url: project.live_url || '',
        skills: project.skills || [],
        sectors: project.sectors || [],
        slug: project.slug || ''
      });
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isNew) {
        await projectsAPI.create(formData);
      } else {
        await projectsAPI.update(slug, formData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addSector = () => {
    if (sectorInput.trim() && !formData.sectors.includes(sectorInput.trim())) {
      setFormData({ ...formData, sectors: [...formData.sectors, sectorInput.trim()] });
      setSectorInput('');
    }
  };

  const removeSector = (sector) => {
    setFormData({ ...formData, sectors: formData.sectors.filter(s => s !== sector) });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Add New Project' : `Edit ${formData.title}`}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="my-project"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Will appear in URL: /projects/[slug]</p>
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                  placeholder="A brief 1-2 sentence description for grid view"
                />
              </div>

              <div>
                <Label htmlFor="summary">Long Description</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={6}
                  placeholder="Detailed project description (supports multiple paragraphs)"
                />
                <p className="text-xs text-gray-500 mt-1">Use line breaks to create paragraphs</p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="main_image_url">Main Image URL</Label>
                <Textarea
                  id="main_image_url"
                  value={formData.main_image_url}
                  onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                  rows={3}
                  placeholder="Single URL or JSON array: ['url1', 'url2']"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For multiple images, use JSON array format
                </p>
              </div>

              <div>
                <Label htmlFor="demo_video_url">Demo Video URL</Label>
                <Textarea
                  id="demo_video_url"
                  value={formData.demo_video_url}
                  onChange={(e) => setFormData({ ...formData, demo_video_url: e.target.value })}
                  rows={3}
                  placeholder="Vimeo embed URL or JSON array with descriptions"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: https://player.vimeo.com/video/1234567
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="live_url">Live Site URL</Label>
                <Input
                  id="live_url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a technology..."
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industries */}
          <Card>
            <CardHeader>
              <CardTitle>Industries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={sectorInput}
                  onChange={(e) => setSectorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                  placeholder="Add an industry..."
                />
                <Button type="button" onClick={addSector}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sectors.map((sector, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full text-white" style={{backgroundColor: '#4242ea'}}>
                    <span className="text-sm">{sector}</span>
                    <button
                      type="button"
                      onClick={() => removeSector(sector)}
                      className="hover:opacity-80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Suggested: B2B, Fintech, Consumer, Education, Healthcare, Real Estate and Construction, Industrials, Government
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
              style={{backgroundColor: '#4242ea'}}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Project'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/projects')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProjectEditPage;

