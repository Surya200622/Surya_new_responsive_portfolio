import { createClient } from '@/lib/supabase/server';
import { Briefcase, Folder, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Projects | Surya CS',
};


export default async function ClientProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user?.id)
    .order('created_at', { ascending: false });

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('completed')) return 'bg-green-500/10 border-green-500/20 text-green-400';
    if (s.includes('development') || s.includes('progress')) return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    if (s.includes('review') || s.includes('testing')) return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
    if (s.includes('cancelled') || s.includes('failed')) return 'bg-red-500/10 border-red-500/20 text-red-400';
    if (s.includes('payment') || s.includes('gathering')) return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Your Projects</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Track the status and details of your requested projects.</p>
        </div>
        <Link href="/dashboard/messages" className="btn bg-[var(--color-accent-primary)] hover:brightness-110 text-[#0a0a0f] text-sm py-2">
          Request New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] flex flex-col h-full group hover:border-[var(--color-accent-primary)]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6 text-[var(--color-accent-primary)]" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-2">{project.project_name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 flex-1">
                {project.description || "No description provided."}
              </p>

              {/* Progress Tracking */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">Project Progress</span>
                  <span className="text-xs font-bold text-[var(--color-accent-primary)]">{project.progress_percentage || 0}%</span>
                </div>
                <div className="h-2 w-full bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-accent-primary)] rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress_percentage || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 mt-auto pt-4 border-t border-[var(--color-glass-border)]">
                {project.timeline && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span>Timeline: {project.timeline}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/dashboard/projects/${project.id}/files`} className="text-[var(--color-accent-primary)] hover:underline text-xs font-medium">
                    View Files
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No projects yet</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              You don't have any active projects right now. Send me a message to get started on your next big idea!
            </p>
            <Link href="/dashboard/messages" className="btn btn--glass inline-flex">
              Start a Conversation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
