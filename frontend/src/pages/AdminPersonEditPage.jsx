import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profilesAPI } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

function AdminPersonEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    x_url: '',
    website_url: '',
    skills: [],
    industry_expertise: [],
    highlights: [],
    experience: [],
    open_to_work: false,
    slug: ''
  });

  // Temporary inputs for arrays
  const [skillInput, setSkillInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchPerson();
    }
  }, [slug, isNew]);

  const fetchPerson = async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getBySlug(slug);
      const person = response.data;
      
      setFormData({
        name: person.name || '',
        title: person.title || '',
        bio: person.bio || '',
        photo_url: person.photo_url || person.photoUrl || '',
        linkedin_url: person.linkedin_url || '',
        x_url: person.x_url || '',
        website_url: person.website_url || '',
        skills: person.skills || [],
        industry_expertise: person.industry_expertise || [],
        highlights: person.highlights || [],
        experience: person.experience || [],
        open_to_work: person.openToWork || false,
        slug: person.slug || ''
      });
    } catch (error) {
      console.error('Error fetching person:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isNew) {
        await profilesAPI.create(formData);
      } else {
        await profilesAPI.update(slug, formData);
      }
      navigate('/admin/people');
    } catch (error) {
      console.error('Error saving person:', error);
      alert('Error saving person. Please try again.');
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

  const addIndustry = () => {
    if (industryInput.trim() && !formData.industry_expertise.includes(industryInput.trim())) {
      setFormData({ ...formData, industry_expertise: [...formData.industry_expertise, industryInput.trim()] });
      setIndustryInput('');
    }
  };

  const removeIndustry = (industry) => {
    setFormData({ ...formData, industry_expertise: formData.industry_expertise.filter(i => i !== industry) });
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { role: '', org: '', dateFrom: '', dateTo: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const removeExperience = (index) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
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
            onClick={() => navigate('/admin/people')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to People
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Add New Person' : `Edit ${formData.name}`}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title/Role *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="john-doe"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Will appear in URL: /people/[slug]</p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open_to_work"
                  checked={formData.open_to_work}
                  onCheckedChange={(checked) => setFormData({ ...formData, open_to_work: checked })}
                />
                <Label htmlFor="open_to_work" className="cursor-pointer">Open to Work</Label>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <Label htmlFor="x_url">X (Twitter) URL</Label>
                <Input
                  id="x_url"
                  value={formData.x_url}
                  onChange={(e) => setFormData({ ...formData, x_url: e.target.value })}
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..."
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                  placeholder="Add an industry..."
                />
                <Button type="button" onClick={addIndustry}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.industry_expertise.map((industry, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{industry}</span>
                    <button
                      type="button"
                      onClick={() => removeIndustry(industry)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  placeholder="Add a highlight..."
                />
                <Button type="button" onClick={addHighlight}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-gray-50 p-3 rounded">
                    <span className="text-sm flex-1">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Experience</span>
                <Button type="button" onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Experience {idx + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Role/Position</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={exp.org}
                        onChange={(e) => updateExperience(idx, 'org', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>From</Label>
                      <Input
                        value={exp.dateFrom}
                        onChange={(e) => updateExperience(idx, 'dateFrom', e.target.value)}
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label>To</Label>
                      <Input
                        value={exp.dateTo}
                        onChange={(e) => updateExperience(idx, 'dateTo', e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.experience.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No experience added yet. Click "Add Experience" to get started.
                </p>
              )}
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
              {saving ? 'Saving...' : 'Save Person'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/people')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminPersonEditPage;

