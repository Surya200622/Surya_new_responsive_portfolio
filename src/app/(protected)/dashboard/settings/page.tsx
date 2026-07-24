'use client';

import { useState, useEffect } from 'react';
import { User, Building, Phone, Lock, Save, Loader2, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ClientSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: ''
  });

  useEffect(() => {
    async function loadData() {
      if (status === 'loading') return;
      if (status === 'unauthenticated' || !session?.user) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const profile = await res.json();
          setForm({
            name: profile.name || '',
            email: profile.email || '',
            companyName: profile.companyName || '',
            phone: profile.phone || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          companyName: form.companyName,
          phone: form.phone
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Account Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your profile and preferences.</p>
      </div>

      <div className="glass-card-strong p-8 rounded-2xl border border-[var(--color-glass-border)] mt-6">
        <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-glass-border)] pb-4">Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input 
                  type="text" 
                  className="auth-input pl-11" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input 
                  type="email" 
                  className="auth-input pl-11 opacity-50 cursor-not-allowed" 
                  value={form.email} 
                  disabled 
                />
              </div>
              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Email cannot be changed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Company</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Building className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input 
                  type="text" 
                  className="auth-input pl-11" 
                  value={form.companyName} 
                  onChange={e => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Company Name" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                <input 
                  type="tel" 
                  className="auth-input pl-11" 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 8900" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
