import { createClient } from '@/lib/supabase/server';
import { Plus, Search, Folder } from 'lucide-react';
import Link from 'next/link';

export default async function AdminProjectsPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      client:profiles(full_name, company_name)
    `)
    .order('created_at', { ascending: false });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      in_progress: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      review: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      completed: 'bg-green-500/10 border-green-500/20 text-green-400',
      cancelled: 'bg-red-500/10 border-red-500/20 text-red-400',
    };
    return map[status] || map.pending;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">All Projects</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Overview of all client projects.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input 
              type="text" 
              className="auth-input pl-9 py-2 text-sm bg-[var(--color-bg-glass)]" 
              placeholder="Search projects..." 
            />
          </div>
          <button className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
              <tr>
                <th className="px-6 py-4">Project Details</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr key={project.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-[var(--color-accent-primary)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)] truncate max-w-[200px]">{project.project_name}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Created {new Date(project.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--color-text-secondary)]">{(project.client as any)?.full_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{(project.client as any)?.company_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(project.status)}`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] font-medium">
                    {project.budget ? `₹${project.budget.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/projects/${project.id}`} className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] font-medium">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}

              {(!projects || projects.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No projects found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
