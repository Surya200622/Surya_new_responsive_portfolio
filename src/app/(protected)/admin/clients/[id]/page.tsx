import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Briefcase, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ClientDetailPageProps {
  params: { id: string };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const supabase = createClient();

  // Fetch client profile
  const { data: client, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'client')
    .single();

  if (error || !client) {
    notFound();
  }

  // Fetch client's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false });

  // Fetch message count
  const { count: messageCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .or(`sender_id.eq.${params.id},receiver_id.eq.${params.id}`);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Clients
      </Link>

      {/* Client Header Card */}
      <div className="glass-card-strong p-8 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5 shrink-0">
            <div className="w-full h-full rounded-2xl bg-[var(--color-bg-primary)] flex items-center justify-center font-display font-bold text-3xl text-[var(--color-text-primary)]">
              {client.full_name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
              {client.full_name || 'Unnamed Client'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {client.company_name || 'Individual Client'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                <a href={`mailto:${client.email}`} className="hover:text-[var(--color-accent-primary)] transition-colors truncate">
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Phone className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:text-[var(--color-accent-primary)] transition-colors">
                    {client.phone}
                  </a>
                </div>
              )}
              {client.company_name && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Building2 className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <span>{client.company_name}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Calendar className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                <span>Joined {new Date(client.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 shrink-0">
            <Link
              href={`/admin/messages?client=${params.id}`}
              className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Projects</span>
          </div>
          <p className="text-2xl font-display font-bold text-[var(--color-text-primary)] ml-11">
            {projects?.length || 0}
          </p>
        </div>
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Messages</span>
          </div>
          <p className="text-2xl font-display font-bold text-[var(--color-text-primary)] ml-11">
            {messageCount || 0}
          </p>
        </div>
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Member Since</span>
          </div>
          <p className="text-lg font-display font-bold text-[var(--color-text-primary)] ml-11">
            {new Date(client.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-6">Projects</h2>

        {projects && projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
                <tr>
                  <th className="px-6 py-3 rounded-tl-xl">Project Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 rounded-tr-xl text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: any) => (
                  <tr key={project.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                      {project.name || project.title || 'Untitled Project'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                        project.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                        project.status === 'in_progress' || project.status === 'active' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                        project.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                        'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]'
                      }`}>
                        {project.status?.replace('_', ' ') || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-[var(--color-text-secondary)]">
                      {project.budget ? `₹${Number(project.budget).toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)] font-medium">No projects yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Projects assigned to this client will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
