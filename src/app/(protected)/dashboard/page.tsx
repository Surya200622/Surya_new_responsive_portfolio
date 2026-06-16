'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowRight, Briefcase, Clock, CheckCircle2, MessageSquare, Folder } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  status: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
}

export default function DashboardOverview() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') { router.push('/admin'); return; }
      if (profile?.full_name) setProfileName(profile.full_name);

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: messageData } = await supabase
        .from('messages')
        .select('id, content, created_at, is_read, sender_id')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (projectData) setProjects(projectData);
      if (messageData) setMessages(messageData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Active Projects</p>
              <h3 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
                {projects.filter(p => !['Completed', 'Cancelled'].includes(p.status)).length}
              </h3>
            </div>
          </div>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
                {projects.filter(p => p.status === 'Completed').length}
              </h3>
            </div>
          </div>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-primary)]/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
          <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-2 relative z-10">Start a new project</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4 relative z-10">Have an idea? Let&apos;s discuss your next big thing.</p>
          <Link href="/dashboard/messages" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors relative z-10">
            Send a message <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">View all</Link>
          </div>
          
          <div className="glass-card p-2 rounded-2xl border border-[var(--color-glass-border)]">
            {projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map(project => (
                  <Link href={`/dashboard/projects`} key={project.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-bg-glass-strong)] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] flex items-center justify-center">
                        <Folder className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{project.project_name}</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Updated {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      project.status === 'Completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      (project.status === 'Development Phase' || project.status === 'Testing Phase' || project.status === 'Design Phase') ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                      {project.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">No projects yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Recent Messages</h2>
            <Link href="/dashboard/messages" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Open Chat</Link>
          </div>
          
          <div className="glass-card p-2 rounded-2xl border border-[var(--color-glass-border)]">
            {messages.length > 0 ? (
              <div className="space-y-2">
                {messages.map(msg => (
                  <Link href="/dashboard/messages" key={msg.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--color-bg-glass-strong)] transition-colors group relative">
                    {!msg.is_read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] p-[1px] shrink-0">
                      <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
                        <img src="/images/surya-portrait.jpg" alt="Surya" className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Surya CS</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-1">{msg.content}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">No recent messages.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
