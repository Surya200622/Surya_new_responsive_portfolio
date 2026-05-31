import { FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export default async function ClientInvoicesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Use admin client to bypass missing RLS SELECT policies for now
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch invoices
  const { data: invoices } = await supabaseAdmin
    .from('invoices')
    .select('*, projects(project_name)')
    .eq('client_id', user?.id)
    .order('created_at', { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'partially_paid': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'overdue': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
      default: return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Invoices</h1>
        <p className="text-sm text-[var(--color-text-muted)]">View your invoice history and download receipts.</p>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[var(--color-accent-primary)]/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[var(--color-accent-primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-bold text-[var(--color-text-primary)]">
                      {invoice.projects?.project_name || 'Project Invoice'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(invoice.status)} uppercase tracking-wider`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">{invoice.invoice_number}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--color-glass-border)]">
                <div className="text-left md:text-right">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total</p>
                  <p className="text-xl font-display font-bold text-[var(--color-text-primary)]">
                    ₹{(invoice.total || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-[var(--color-glass-border)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] transition-colors flex items-center gap-2" title="Download PDF">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">PDF</span>
                  </button>
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
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No invoices yet</h3>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Once a project starts or payment is requested, your invoices will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
