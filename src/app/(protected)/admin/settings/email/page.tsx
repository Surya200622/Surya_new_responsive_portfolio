'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Mail, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function EmailSettingsPage() {
  const { data: session } = useSession();
  const [emailUser, setEmailUser] = useState('');
  const [emailPass, setEmailPass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/email');
      if (res.ok) {
        const data = await res.json();
        setEmailUser(data.emailUser || '');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailUser, emailPass }),
      });

      if (res.ok) {
        setMessage({ text: 'Email settings saved successfully!', type: 'success' });
        setEmailPass(''); // Clear the password field for security
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred while saving', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Email Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Configure Nodemailer SMTP for sending emails to clients.</p>
      </div>

      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] max-w-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-glass-border)]">
          <Mail className="text-[var(--color-accent-primary)]" size={20} />
          <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)]">SMTP Configuration (Gmail)</h3>
        </div>

        {message.text && (
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
              placeholder="e.g., cssurya2006@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Google App Password
            </label>
            <input
              type="password"
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
              value={emailPass}
              onChange={(e) => setEmailPass(e.target.value)}
              placeholder="Leave blank to keep existing password"
              required={!emailUser}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Standard Google passwords won't work. Generate a 16-character App Password from your Google Account settings.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading || isSaving}
              className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 text-[var(--color-bg-primary)] px-6 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
