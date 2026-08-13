'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { 
  PROJECT_TYPES, 
  FEATURE_COSTS, 
  MAINTENANCE_OPTIONS, 
  DELIVERY_SPEEDS, 
  PACKAGES 
} from '@/data/calculatorData';

const DEFAULT_CONFIG = {
  PROJECT_TYPES,
  FEATURE_COSTS,
  MAINTENANCE_OPTIONS,
  DELIVERY_SPEEDS,
  PACKAGES
};

export default function CalculatorSettingsPage() {
  const [configStr, setConfigStr] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings?key=calculator_data');
      if (res.ok) {
        const data = await res.json();
        if (data.value && typeof data.value === 'object') {
          setConfigStr(JSON.stringify(data.value, null, 2));
        } else {
          setConfigStr(JSON.stringify(DEFAULT_CONFIG, null, 2));
        }
      } else {
        setConfigStr(JSON.stringify(DEFAULT_CONFIG, null, 2));
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
      setError('Failed to load current configuration.');
      setConfigStr(JSON.stringify(DEFAULT_CONFIG, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    let parsedConfig;
    
    try {
      parsedConfig = JSON.parse(configStr);
    } catch (e) {
      setError('Invalid JSON format. Please check for syntax errors like missing commas or quotes.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'calculator_data', value: parsedConfig }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setSuccess('Calculator configuration saved successfully! Changes are now live.');
      // Reformat the text
      setConfigStr(JSON.stringify(parsedConfig, null, 2));
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default configuration? Any unsaved changes will be lost.')) {
      setConfigStr(JSON.stringify(DEFAULT_CONFIG, null, 2));
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
            Calculator Settings
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl">
            Edit the underlying data for the project budget calculator. Modify base prices, feature costs, multipliers, and packages using JSON.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white bg-[var(--color-bg-glass)] hover:bg-[var(--color-bg-glass-strong)] border border-[var(--color-glass-border)] rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="gradient-btn flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent-primary)]/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Configuration</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
          {success}
        </div>
      )}

      <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden flex flex-col" style={{ minHeight: '600px', height: 'calc(100vh - 240px)' }}>
        <div className="bg-[#1e1e1e] border-b border-[#333] px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-2 text-xs font-mono text-gray-400">calculator_data.json</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e]">
            <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin mb-4" />
            <p className="text-gray-400 text-sm font-mono">Loading configuration...</p>
          </div>
        ) : (
          <textarea
            value={configStr}
            onChange={(e) => setConfigStr(e.target.value)}
            className="flex-1 w-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] leading-relaxed resize-none outline-none custom-scrollbar"
            spellCheck="false"
            placeholder="{}"
          />
        )}
      </div>
    </div>
  );
}
