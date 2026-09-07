'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, MessageCircle } from 'lucide-react';

const DEFAULT_COMMANDS = [
  'start',
  'services',
  'portfolio',
  'offers',
  'contact',
  'about',
  'skills',
  'reviews',
];

export default function TelegramSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [commands, setCommands] = useState<Record<string, string>>({});

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
        const res = await fetch('/api/admin/telegram');
        if (res.ok) {
          const data = await res.json();
          const initial: Record<string, string> = {};
          DEFAULT_COMMANDS.forEach(cmd => {
            initial[`telegram_cmd_${cmd}`] = data[`telegram_cmd_${cmd}`] || '';
          });
          setCommands({ ...initial, ...data });
        }
      } catch (e) {
        console.error('Failed to load telegram settings', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [status, session, router]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/telegram', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commands)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Save error', e);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (cmd: string, value: string) => {
    setCommands(prev => ({ ...prev, [`telegram_cmd_${cmd}`]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text-primary)]">
            Telegram Bot Settings
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage the hardcoded responses for Telegram bot commands. 
            Leave a field blank to fallback to the code's default text.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0 justify-center"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {DEFAULT_COMMANDS.map((cmd) => (
          <div key={cmd} className="glass-card p-5 sm:p-6 rounded-2xl border border-[var(--color-glass-border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-primary)]/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] font-display text-lg">/{cmd}</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Response for the /{cmd} command</p>
              </div>
            </div>
            
            <textarea
              className="auth-input w-full min-h-[150px] p-4 text-sm resize-y custom-scrollbar"
              placeholder={`Enter hardcoded text for /${cmd} (leave empty to use default)`}
              value={commands[`telegram_cmd_${cmd}`] || ''}
              onChange={(e) => handleChange(cmd, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
