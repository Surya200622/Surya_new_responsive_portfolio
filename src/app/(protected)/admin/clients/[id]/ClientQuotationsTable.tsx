'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  'draft',
  'sent',
  'accepted',
  'rejected',
  'advance_paid',
  'fully_paid'
];

export default function ClientQuotationsTable({ initialQuotations }: { initialQuotations: any[] }) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    setUpdatingId(quoteId);
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;

      setQuotations(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
      router.refresh();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'fully_paid') return 'bg-green-500/10 border-green-500/30 text-green-500';
    if (status === 'advance_paid') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
    if (status === 'accepted') return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    if (status === 'rejected') return 'bg-red-500/10 border-red-500/30 text-red-500';
    if (status === 'sent') return 'bg-purple-500/10 border-purple-500/30 text-purple-500';
    return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (quotations.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[var(--color-glass-border)] rounded-xl">
        <FileText className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
        <p className="text-[var(--color-text-secondary)] font-medium">No quotations yet</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Quotations and invoices will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm text-left">
        <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
          <tr>
            <th className="px-6 py-3 rounded-tl-xl">Quote / Project</th>
            <th className="px-6 py-3">Total Amount</th>
            <th className="px-6 py-3">Payment Status</th>
            <th className="px-6 py-3 rounded-tr-xl">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quote) => (
            <tr key={quote.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
              <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                <div>QT-{quote.id.split('-')[0].toUpperCase()}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-normal mt-1">
                  {quote.projects?.project_name || 'No Project Linked'}
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-[var(--color-accent-primary)]">
                ₹{(quote.total || 0).toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <select
                    value={quote.status || 'draft'}
                    onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    disabled={updatingId === quote.id}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border cursor-pointer outline-none appearance-none transition-colors ${getStatusColor(quote.status)}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                        {formatStatus(opt)}
                      </option>
                    ))}
                  </select>
                  {updatingId === quote.id && <Loader2 className="w-3 h-3 animate-spin text-[var(--color-text-muted)]" />}
                </div>
              </td>
              <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                {new Date(quote.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
