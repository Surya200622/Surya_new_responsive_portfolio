import { FileText, Download } from 'lucide-react';

export default function ClientQuotationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Quotations & Invoices</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Review and accept project proposals.</p>
      </div>

      <div className="glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center mt-6">
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No quotations yet</h3>
        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
          When we discuss a project, official quotations and proposals will appear here for your review and approval.
        </p>
      </div>
    </div>
  );
}
