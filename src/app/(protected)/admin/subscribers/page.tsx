import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Mail, Calendar, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SubscribersPage() {
  const allSubscribers = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Newsletter Subscribers</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage all your newsletter subscribers.</p>
      </div>

      <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-tertiary)]/50 border-b border-[var(--color-glass-border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Email</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Subscribed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-glass-border)]">
              {allSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--color-bg-tertiary)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[var(--color-text-primary)]">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'active' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      <Activity className="w-3.5 h-3.5" />
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 opacity-50" />
                      {new Date(sub.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              {allSubscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No subscribers yet.
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
