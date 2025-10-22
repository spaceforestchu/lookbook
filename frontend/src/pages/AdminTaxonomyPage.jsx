import { useState, useEffect } from 'react';
import { taxonomyAPI } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

function AdminTaxonomyPage() {
  const [skills, setSkills] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');
  
  // Edit states
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newIndustryName, setNewIndustryName] = useState('');
  const [newIndustryDesc, setNewIndustryDesc] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsRes, industriesRes] = await Promise.all([
        taxonomyAPI.getAllSkills(),
        taxonomyAPI.getAllIndustries()
      ]);
      setSkills(skillsRes.data || []);
      setIndustries(industriesRes.data || []);
    } catch (error) {
      console.error('Error fetching taxonomy:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // SKILL HANDLERS
  const handleCreateSkill = async () => {
    if (!newSkillName.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      await taxonomyAPI.createSkill({ 
        name: newSkillName.trim(),
        category: newSkillCategory.trim() || null
      });
      toast.success('Skill created successfully');
      setNewSkillName('');
      setNewSkillCategory('');
      fetchData();
    } catch (error) {
      console.error('Error creating skill:', error);
      toast.error(error.response?.data?.error || 'Failed to create skill');
    }
  };

  const handleUpdateSkill = async (skill) => {
    try {
      await taxonomyAPI.updateSkill(skill.id, {
        name: skill.name,
        category: skill.category || null,
        display_order: skill.display_order
      });
      toast.success('Skill updated successfully');
      setEditingSkill(null);
      fetchData();
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error(error.response?.data?.error || 'Failed to update skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await taxonomyAPI.deleteSkill(id);
      toast.success('Skill deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  // INDUSTRY HANDLERS
  const handleCreateIndustry = async () => {
    if (!newIndustryName.trim()) {
      toast.error('Industry name is required');
      return;
    }

    try {
      await taxonomyAPI.createIndustry({ 
        name: newIndustryName.trim(),
        description: newIndustryDesc.trim() || null
      });
      toast.success('Industry created successfully');
      setNewIndustryName('');
      setNewIndustryDesc('');
      fetchData();
    } catch (error) {
      console.error('Error creating industry:', error);
      toast.error(error.response?.data?.error || 'Failed to create industry');
    }
  };

  const handleUpdateIndustry = async (industry) => {
    try {
      await taxonomyAPI.updateIndustry(industry.id, {
        name: industry.name,
        description: industry.description || null,
        display_order: industry.display_order
      });
      toast.success('Industry updated successfully');
      setEditingIndustry(null);
      fetchData();
    } catch (error) {
      console.error('Error updating industry:', error);
      toast.error(error.response?.data?.error || 'Failed to update industry');
    }
  };

  const handleDeleteIndustry = async (id) => {
    if (!confirm('Are you sure you want to delete this industry?')) return;

    try {
      await taxonomyAPI.deleteIndustry(id);
      toast.success('Industry deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting industry:', error);
      toast.error('Failed to delete industry');
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Skills & Industries</h1>
          <p className="text-gray-500 mt-1">Manage standardized taxonomy for the platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('industries')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'industries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Industries ({industries.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Add New Skill */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Skill
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Skill name (e.g., Python)"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateSkill()}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Category (optional)"
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateSkill()}
                        className="w-48"
                      />
                      <Button 
                        onClick={handleCreateSkill}
                        style={{backgroundColor: '#4242ea'}}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills List by Category */}
                <div className="space-y-4">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="text-lg">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categorySkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              {editingSkill?.id === skill.id ? (
                                <div className="flex gap-2 flex-1">
                                  <Input
                                    value={editingSkill.name}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                                    className="flex-1"
                                  />
                                  <Input
                                    value={editingSkill.category || ''}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                                    placeholder="Category"
                                    className="w-40"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateSkill(editingSkill)}
                                    style={{backgroundColor: '#4242ea'}}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingSkill(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{skill.name}</span>
                                    {skill.category && (
                                      <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                                        {skill.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingSkill(skill)}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteSkill(skill.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* INDUSTRIES TAB */}
            {activeTab === 'industries' && (
              <div className="space-y-6">
                {/* Add New Industry */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Industry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Industry name (e.g., Healthcare)"
                        value={newIndustryName}
                        onChange={(e) => setNewIndustryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleCreateIndustry()}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={newIndustryDesc}
                        onChange={(e) => setNewIndustryDesc(e.target.value)}
                      />
                      <Button 
                        onClick={handleCreateIndustry}
                        style={{backgroundColor: '#4242ea'}}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Industry
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Industries List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {industries.map((industry) => (
                    <Card key={industry.id}>
                      <CardContent className="p-4">
                        {editingIndustry?.id === industry.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingIndustry.name}
                              onChange={(e) => setEditingIndustry({ ...editingIndustry, name: e.target.value })}
                            />
                            <Input
                              value={editingIndustry.description || ''}
                              onChange={(e) => setEditingIndustry({ ...editingIndustry, description: e.target.value })}
                              placeholder="Description"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateIndustry(editingIndustry)}
                                style={{backgroundColor: '#4242ea'}}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingIndustry(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">{industry.name}</h3>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingIndustry(industry)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteIndustry(industry.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {industry.description && (
                              <p className="text-sm text-gray-600">{industry.description}</p>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminTaxonomyPage;

