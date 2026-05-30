'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Loader2, Save, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';

const projectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image path/URL is required'),
  tech_array: z.string().min(1, 'Tech stack is required'), // We'll convert comma separated to array
  year: z.string().min(4, 'Year is required'),
  link: z.string().optional(),
  buyable: z.boolean(),
  hide_link: z.boolean(),
});

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tech_array: string[];
  year: string;
  link?: string;
  buyable: boolean;
  hide_link: boolean;
  created_at: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    description: '',
    image: '',
    tech_array: '',
    year: new Date().getFullYear().toString(),
    link: '',
    buyable: false,
    hide_link: false,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setImageUploading(true);
      setError('');
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError('Error uploading image: ' + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    setError('');
    if (project) {
      setEditingId(project.id);
      setFormData({
        slug: project.slug,
        title: project.title,
        category: project.category,
        description: project.description,
        image: project.image,
        tech_array: project.tech_array.join(', '),
        year: project.year,
        link: project.link || '',
        buyable: project.buyable || false,
        hide_link: project.hide_link || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        slug: '', title: '', category: '', description: '', image: '', tech_array: '', 
        year: new Date().getFullYear().toString(), link: '', buyable: false, hide_link: false
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const validData = projectSchema.parse(formData);
      const techArray = validData.tech_array.split(',').map(s => s.trim()).filter(Boolean);

      const dbData = {
        slug: validData.slug,
        title: validData.title,
        category: validData.category,
        description: validData.description,
        image: validData.image,
        tech_array: techArray,
        year: validData.year,
        link: validData.link,
        buyable: validData.buyable,
        hide_link: validData.hide_link,
      };

      if (editingId) {
        const { error } = await supabase.from('projects').update(dbData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([dbData]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchProjects();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-card-strong rounded-2xl overflow-hidden border border-[var(--color-glass-border)] flex flex-col">
            <div className="h-48 relative overflow-hidden bg-[var(--color-bg-secondary)]">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleOpenModal(project)} className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[var(--color-accent-primary)] transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-[var(--color-text-primary)] text-lg line-clamp-1">{project.title}</h3>
                <span className="text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-md">{project.year}</span>
              </div>
              <p className="text-xs font-semibold text-[var(--color-accent-primary)] mb-3">{project.category}</p>
              
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 flex-1">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech_array.slice(0, 3).map((t, i) => (
                  <span key={i} className="text-[10px] bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
                {project.tech_array.length > 3 && (
                  <span className="text-[10px] bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded">
                    +{project.tech_array.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-glass-border)] mt-auto">
                <div className="flex items-center gap-2 text-xs">
                  {project.buyable && <span className="w-2 h-2 rounded-full bg-green-500" title="Buyable"></span>}
                  {project.hide_link && <span className="w-2 h-2 rounded-full bg-orange-500" title="Link Hidden"></span>}
                </div>
                {project.link && !project.hide_link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] flex items-center gap-1 transition-colors">
                    Visit Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-card-strong p-12 text-center rounded-2xl border border-[var(--color-glass-border)]">
          <p className="text-[var(--color-text-secondary)]">No projects found in the database.</p>
          <button onClick={() => handleOpenModal()} className="mt-4 text-[var(--color-accent-primary)] hover:underline text-sm font-medium">
            Create your first project
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-glass-border)] shrink-0">
              <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)]">
                {editingId ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-[var(--color-bg-glass)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form id="project-form" onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      className="auth-input px-4"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">ID / Slug</label>
                    <input
                      type="text"
                      className="auth-input px-4"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. dental-experts"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      className="auth-input px-4"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Web Application"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Year</label>
                    <input
                      type="text"
                      className="auth-input px-4"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    className="auth-input px-4 py-3 min-h-[100px] resize-y"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the project..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    className="auth-input px-4"
                    value={formData.tech_array}
                    onChange={e => setFormData({ ...formData, tech_array: e.target.value })}
                    placeholder="React, Node.js, Supabase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Project Image</label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[var(--color-glass-border)] shrink-0" />
                      )}
                      <label className="flex-1 cursor-pointer flex items-center justify-center py-2 px-4 border border-dashed border-[var(--color-text-muted)] rounded-xl hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-glass)] transition-colors h-[48px]">
                        {imageUploading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent-primary)]" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                            <span className="text-xs text-[var(--color-text-secondary)]">Upload image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">External Link</label>
                    <input
                      type="text"
                      className="auth-input px-4"
                      value={formData.link}
                      onChange={e => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.buyable}
                        onChange={e => setFormData({ ...formData, buyable: e.target.checked })}
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${formData.buyable ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-bg-secondary)]'}`}>
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.buyable ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <span className="text-sm text-[var(--color-text-secondary)]">Show "Buy" Button</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.hide_link}
                        onChange={e => setFormData({ ...formData, hide_link: e.target.checked })}
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${formData.hide_link ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-bg-secondary)]'}`}>
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.hide_link ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <span className="text-sm text-[var(--color-text-secondary)]">Hide Link Button</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-glass-border)] shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-form"
                disabled={saving}
                className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
