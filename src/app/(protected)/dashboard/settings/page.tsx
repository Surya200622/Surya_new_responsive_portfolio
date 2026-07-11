import { createClient } from '@/lib/supabase/server';
import { User, Building, Phone, Lock, Save } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Settings | Surya CS',
};


export default async function ClientSettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Account Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your profile and preferences.</p>
      </div>

      <div className="glass-card-strong p-8 rounded-2xl border border-[var(--color-glass-border)] mt-6">
        <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-glass-border)] pb-4">Profile Information</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input type="text" className="auth-input pl-11" defaultValue={profile?.full_name} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input type="email" className="auth-input pl-11 opacity-50" defaultValue={profile?.email} disabled />
              </div>
              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Email cannot be changed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Company</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Building className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input type="text" className="auth-input pl-11" defaultValue={profile?.company_name || ''} placeholder="Company Name" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input type="tel" className="auth-input pl-11" defaultValue={profile?.phone || ''} placeholder="+1 234 567 8900" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
