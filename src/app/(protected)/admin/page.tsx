'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, MessageSquare, IndianRupee, Calculator, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  // Fallback if users table doesn't have created_at
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculatorEnabled, setCalculatorEnabled] = useState(true);
  const [calculatorToggling, setCalculatorToggling] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (status === 'loading') return;
      if (status === 'unauthenticated' || !session?.user) {
        router.push('/login'); 
        return;
      }
      
      // @ts-ignore
      if (session.user.role !== 'admin') {
        router.push('/dashboard'); 
        return;
      }

      try {
        const res = await fetch('/api/admin/summary');
        if (res.ok) {
          const data = await res.json();
          setClientCount(data.clientCount || 0);
          setProjectCount(data.projectCount || 0);
          setUnreadCount(data.unreadCount || 0);
          setRevenue(data.revenue || 0);
          setRecentClients(data.recentClients || []);
        }

        // Fetch calculator toggle state
        try {
          const resSettings = await fetch('/api/admin/settings?key=calculator_enabled');
          const settingData = await resSettings.json();
          setCalculatorEnabled(settingData.value === true || settingData.value === 'true');
        } catch {
          console.warn('Failed to fetch calculator setting');
        }
      } catch (e) {
        console.warn('Admin data load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [status, session, router]);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Total Clients</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{clientCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Active Projects</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{projectCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Unread Msgs</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{unreadCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Revenue (Est)</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">₹{revenue.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* Site Controls */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-5">Site Controls</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] group hover:border-[var(--color-accent-primary)]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${calculatorEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <Calculator className={`w-5 h-5 transition-colors duration-300 ${calculatorEnabled ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Pricing Calculator</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {calculatorEnabled ? 'Visible on the public site' : 'Hidden from the public site'}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              setCalculatorToggling(true);
              const newValue = !calculatorEnabled;
              try {
                const res = await fetch('/api/admin/settings', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ key: 'calculator_enabled', value: newValue }),
                });
                if (res.ok) {
                  setCalculatorEnabled(newValue);
                }
              } catch (e) {
                console.error('Toggle failed:', e);
              }
              setCalculatorToggling(false);
            }}
            disabled={calculatorToggling}
            className="relative shrink-0 cursor-pointer disabled:cursor-wait"
            aria-label={calculatorEnabled ? 'Disable pricing calculator' : 'Enable pricing calculator'}
          >
            {calculatorToggling ? (
              <div className="w-[52px] h-[28px] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : (
              <div className={`w-[52px] h-[28px] rounded-full transition-colors duration-300 ${calculatorEnabled ? 'bg-emerald-500' : 'bg-[var(--color-bg-tertiary)]'}`}>
                <div className={`w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 mt-[2px] ${calculatorEnabled ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Recent Signups</h2>
          <Link href="/admin/clients" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Client</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3 rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client) => (
                <tr key={client.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] p-0.5">
                      <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-xs text-[var(--color-text-primary)]">
                        {client.name?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                    </div>
                    {client.name || 'Unnamed Client'}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{client.companyName || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] font-medium">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
