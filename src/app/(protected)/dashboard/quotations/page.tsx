import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Quotations | Surya CS',
};

import { FileText, Download, CheckCircle, Clock } from 'lucide-react';
import QuotationActions from './QuotationActions';
import DownloadQuotationButton from '@/components/pdf/DownloadQuotationButton';
import PayUPIButton from './PayUPIButton';

import { db } from '@/db';
import { quotations, projects, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ClientQuotationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  // @ts-ignore
  const userId = session.user.id;

  // Fetch quotations and their linked project names
  const userQuotationsData = await db
    .select({
      quotation: quotations,
      project: projects,
    })
    .from(quotations)
    .leftJoin(projects, eq(quotations.projectId, projects.id))
    .where(eq(quotations.clientId, userId))
    .orderBy(desc(quotations.createdAt));

  // Transform to match existing interface
  const userQuotations = userQuotationsData.map(row => ({
    ...row.quotation,
    projects: row.project ? { 
      project_name: row.project.title, // mapped from projects.title 
      reference_code: `PRJ-${row.project.id.substring(0, 8).toUpperCase()}` 
    } : null,
  }));

  // Fetch admin id for notifications
  const adminData = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin')).limit(1);
  const adminId = adminData[0]?.id || null;

  // Client profile info
  const userProfile = {
    full_name: session.user.name || session.user.email?.split('@')[0] || 'Client'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'advance_paid': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'accepted': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'sent': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'rejected': return 'bg-red-500/10 border-red-500/20 text-red-400';
      default: return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Quotations & Invoices</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Review and accept project proposals.</p>
      </div>

      {userQuotations && userQuotations.length > 0 ? (
        <div className="grid gap-4">
          {userQuotations.map((quote) => (
            <div key={quote.id} className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[var(--color-accent-primary)]/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[var(--color-accent-primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-bold text-[var(--color-text-primary)]">
                      {quote.projects?.project_name || 'Project Quotation'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(quote.status)} uppercase tracking-wider`}>
                      {quote.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Generated on {(() => {
                      let d = quote.createdAt ? new Date(quote.createdAt) : new Date();
                      if (isNaN(d.getTime()) || d.getFullYear() === 1970) d = new Date();
                      return d.toLocaleDateString();
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-glass-border)] md:border-t-0 md:pt-0">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Estimated Cost</p>
                  <p className="text-xl font-display font-bold text-[var(--color-text-primary)]">
                    ₹{(quote.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
                  {quote.status !== 'rejected' && quote.status !== 'fully_paid' && (
                    <PayUPIButton 
                      amount={quote.amount || 0} 
                      projectName={quote.projects?.project_name || 'Project Quotation'}
                      projectId={quote.projectId!}
                      quotationId={quote.id}
                      referenceCode={quote.projects?.reference_code || `QUOTE-${quote.id.substring(0, 8).toUpperCase()}`}
                    />
                  )}
                  <DownloadQuotationButton 
                    quote={{
                      ...quote,
                      created_at: quote.createdAt,
                      total: quote.amount,
                    }} 
                    clientName={userProfile?.full_name || 'Client'} 
                  />
                  {quote.status !== 'accepted' && quote.status !== 'rejected' && (
                    <QuotationActions 
                      quoteId={quote.id} 
                      projectId={quote.projectId!}
                      adminId={adminId!}
                      clientName={userProfile?.full_name || 'A client'}
                      projectName={quote.projects?.project_name || 'Project Quotation'}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center mt-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No quotations yet</h3>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            When we discuss a project or you use the pricing calculator, official quotations will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
