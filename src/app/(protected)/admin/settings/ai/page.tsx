'use client';
import { toast } from 'react-hot-toast';


import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function AISettingsPage() {
  const { data: session } = useSession();
  const [groqModels, setGroqModels] = useState('');
  const [openRouterModels, setOpenRouterModels] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAISettings();
  }, []);

  const fetchAISettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/ai');
      if (res.ok) {
        const data = await res.json();
        setGroqModels(data.groqModels || '');
        setOpenRouterModels(data.openRouterModels || '');
      }
    } catch (error) {
      console.error('Failed to fetch AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    

    try {
      const res = await fetch('/api/admin/settings/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groqModels, openRouterModels }),
      });

      if (res.ok) {
        toast.success('AI model settings saved successfully!')
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">AI Chatbot Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Configure fallback models for the AI Chatbot to avoid rate limiting or decommissioned models.</p>
      </div>

      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] max-w-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-glass-border)]">
          <Settings className="text-[var(--color-accent-primary)]" size={20} />
          <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)]">Model Configuration</h3>
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
              Groq Models (Comma separated)
            </label>
            <input
              type="text"
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
              value={groqModels}
              onChange={(e) => setGroqModels(e.target.value)}
              placeholder="e.g., groq/compound, qwen/qwen3.8-27b"
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Models are tried sequentially until one succeeds.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              OpenRouter Fallback Models (Comma separated)
            </label>
            <input
              type="text"
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
              value={openRouterModels}
              onChange={(e) => setOpenRouterModels(e.target.value)}
              placeholder="e.g., nvidia/nemotron-3.5-lightning:free, liquid/lfm-2.5-2.6b:free"
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              These models are used if Groq fails entirely (e.g., rate limit exceeded or all models fail).
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
