'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Users, Briefcase, MessageSquare, IndianRupee } from 'lucide-react';

interface Client {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  created_at: string;
}

export default function AdminOverviewPage() {
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
      try {
        const { count: cc } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client');
        const { count: pc } = await supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'completed').neq('status', 'cancelled');
        const { count: uc } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

        const { data: clients } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'client')
          .order('created_at', { ascending: false })
          .limit(5);

        setClientCount(cc || 0);
        setProjectCount(pc || 0);
        setUnreadCount(uc || 0);
        if (clients) setRecentClients(clients);
      } catch (e) {
        console.warn('Admin data load error:', e);
      }
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
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">₹0</h3>
        </div>
      </div>

      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Recent Signups</h2>
          <Link href="/admin/clients" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Client</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client) => (
                <tr key={client.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5">
                      <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-xs text-[var(--color-text-primary)]">
                        {client.full_name.charAt(0)}
                      </div>
                    </div>
                    {client.full_name}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{client.company_name || '-'}</td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{new Date(client.created_at).toLocaleDateString()}</td>
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
