import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Folder, Calendar, Clock, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectStatusUpdater from './ProjectStatusUpdater';
import DownloadQuotationButton from '@/components/pdf/DownloadQuotationButton';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const supabase = createClient();

  // Fetch project with client details
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:profiles(id, full_name, company_name, email)
    `)
    .eq('id', params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch quotations for this project
  const { data: quotations } = await supabase
    .from('quotations')
    .select('*')
    .eq('project_id', project.id)
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

  const clientInfo = project.client as any;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      {/* Project Header Card */}
      <div className="glass-card-strong p-8 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0 border border-[var(--color-glass-border)]">
            <Folder className="w-8 h-8 text-[var(--color-accent-primary)]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
              <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
                {project.project_name}
              </h1>
              <ProjectStatusUpdater projectId={project.id} currentStatus={project.status} />
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-3xl">
              {project.description || 'No description provided for this project.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[var(--color-glass-border)]">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Budget</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {project.budget ? `₹${project.budget.toLocaleString('en-IN')}` : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Timeline</p>
                <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                  {project.timeline || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Created</p>
                <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] h-fit">
          <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--color-accent-primary)]" />
            Client Details
          </h2>
          {clientInfo ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Name</p>
                <Link href={`/admin/clients/${clientInfo.id}`} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
                  {clientInfo.full_name || 'Unnamed'}
                </Link>
              </div>
              {clientInfo.company_name && (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Company</p>
                  <p className="text-[var(--color-text-secondary)]">{clientInfo.company_name}</p>
                </div>
              )}
              {clientInfo.email && (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Email</p>
                  <a href={`mailto:${clientInfo.email}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] break-all">
                    {clientInfo.email}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No client associated with this project.</p>
          )}
        </div>

        {/* Quotations */}
        <div className="lg:col-span-2 glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-accent-primary)]" />
            Quotations
          </h2>
          
          {quotations && quotations.length > 0 ? (
            <div className="space-y-3">
              {quotations.map((quote) => (
                <div key={quote.id} className="p-4 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        ₹{(quote.total || 0).toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        quote.status === 'fully_paid' ? 'bg-green-500/10 text-green-400' :
                        quote.status === 'advance_paid' ? 'bg-emerald-500/10 text-emerald-400' :
                        quote.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' :
                        quote.status === 'sent' ? 'bg-purple-500/10 text-purple-400' :
                        quote.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {quote.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Generated on {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <DownloadQuotationButton 
                    quote={quote} 
                    clientName={clientInfo?.full_name || 'Client'} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-[var(--color-glass-border)] rounded-xl">
              <p className="text-[var(--color-text-secondary)]">No quotations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
