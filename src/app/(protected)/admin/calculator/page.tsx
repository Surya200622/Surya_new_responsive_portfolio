'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, RefreshCcw, AlertTriangle, Package, FileCode2, Server, Settings2, ShieldCheck, Check } from 'lucide-react';
import { 
  PROJECT_TYPES, FEATURE_COSTS, MAINTENANCE_OPTIONS, DELIVERY_SPEEDS, PACKAGES, ADDON_CATEGORIES
} from '@/data/calculatorData';
import { ArrayEditor, ObjectEditor } from './components/GenericEditor';

const DEFAULT_CONFIG = {
  PROJECT_TYPES, FEATURE_COSTS, MAINTENANCE_OPTIONS, DELIVERY_SPEEDS, PACKAGES, ADDON_CATEGORIES
};

const PROJECT_SCHEMA: any = [
  { key: 'id', label: 'ID (unique, e.g. landing-page)', type: 'text' },
  { key: 'name', label: 'Project Name', type: 'text' },
  { key: 'icon', label: 'Icon (Lucide name)', type: 'text' },
  { key: 'basePrice', label: 'Base Price (Rs)', type: 'number' },
  { key: 'baseTimeline', label: 'Base Timeline (Days)', type: 'number' },
  { key: 'hasAddons', label: 'Enable Infrastructure Add-ons?', type: 'boolean' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const PACKAGE_SCHEMA: any = [
  { key: 'id', label: 'ID (unique)', type: 'text' },
  { key: 'name', label: 'Package Name', type: 'text' },
  { key: 'cost', label: 'Fixed Price (Rs)', type: 'number' },
  { key: 'multiplier', label: 'Price Multiplier (e.g. 1.0 or 1.5)', type: 'number' },
  { key: 'timelineMultiplier', label: 'Timeline Multiplier', type: 'number' },
  { key: 'support', label: 'Support Text', type: 'text' },
  { key: 'badge', label: 'Badge (Optional)', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'features', label: 'Features (One per line)', type: 'stringArray' },
];

const FEATURE_SCHEMA: any = [
  { key: 'label', label: 'Feature Label', type: 'text' },
  { key: 'cost', label: 'Cost (Rs)', type: 'number' },
  { key: 'timeline', label: 'Timeline (Days)', type: 'number' },
  { key: 'icon', label: 'Icon (Lucide name)', type: 'text' },
];

const OPTION_SCHEMA: any = [
  { key: 'value', label: 'Value/ID (unique)', type: 'text' },
  { key: 'label', label: 'Display Label', type: 'text' },
  { key: 'cost', label: 'Cost (Rs)', type: 'number' },
  { key: 'timeline', label: 'Timeline (Days)', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const SPEED_SCHEMA: any = [
  { key: 'label', label: 'Label', type: 'text' },
  { key: 'multiplier', label: 'Price Multiplier (e.g. 1.5)', type: 'number' },
];

export default function CalculatorSettingsPage() {
  const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedPackageProject, setSelectedPackageProject] = useState('landing');

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
          // If PACKAGES is an array (from old schema), ignore it so it falls back to DEFAULT_CONFIG object
          if (Array.isArray(data.value.PACKAGES)) {
            delete data.value.PACKAGES;
          }
          // Merge with defaults to ensure new missing categories exist
          setConfig({ ...DEFAULT_CONFIG, ...data.value });
        }
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
      setError('Failed to load current configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'calculator_data', value: config }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setSuccess('Calculator configuration saved successfully! Changes are now live.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default configuration? Any unsaved changes will be lost.')) {
      setConfig(DEFAULT_CONFIG);
      setError('');
      setSuccess('');
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FileCode2 },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'features', label: 'Features', icon: ShieldCheck },
    { id: 'providers', label: 'Providers', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin mb-4" />
        <p className="text-gray-400">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
            Calculator Form Editor
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl">
            Visually edit all pricing rules, packages, features, and providers for your pricing calculator.
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
            disabled={saving}
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
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-3">
          <Check className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30' 
                  : 'bg-[var(--color-bg-glass)] text-gray-400 hover:text-white border border-[var(--color-glass-border)] hover:bg-[var(--color-bg-glass-strong)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 mt-6">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <ArrayEditor 
              title="Project Types" 
              description="Base projects that users can select from (e.g. Landing Page, Ecommerce)."
              value={config.PROJECT_TYPES || []} 
              schema={PROJECT_SCHEMA} 
              onChange={(val) => updateConfig('PROJECT_TYPES', val)}
              itemTitleKey="name"
            />
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Packages by Project Type</h2>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">Each project type has its own distinct set of packages, features, and multipliers.</p>
              
              <div className="flex flex-wrap gap-2">
                {(config.PROJECT_TYPES || []).filter((p: any) => !['marketing', 'promo-graphics', 'ai-faceswap'].includes(p.id)).map((project: any) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedPackageProject(project.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPackageProject === project.id
                        ? 'bg-[var(--color-accent-primary)] text-white'
                        : 'bg-[var(--color-bg-glass)] text-gray-400 hover:text-white border border-[var(--color-glass-border)]'
                    }`}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </div>
            
            {(config.PROJECT_TYPES || [])
              .filter((p: any) => p.id === selectedPackageProject)
              .map((project: any) => (
              <div key={project.id}>
                <ArrayEditor 
                  title={`${project.name} Packages`}
                  description={`Manage packages specifically for ${project.name}.`}
                  value={config.PACKAGES?.[project.id] || []} 
                  schema={PACKAGE_SCHEMA} 
                  onChange={(val) => {
                    const newPackages = { ...(config.PACKAGES || {}) };
                    newPackages[project.id] = val;
                    updateConfig('PACKAGES', newPackages);
                  }}
                  itemTitleKey="name"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <ObjectEditor 
              title="Feature Costs" 
              description="Add-on features that users can toggle. Keys are used internally in the codebase."
              value={config.FEATURE_COSTS || {}} 
              schema={FEATURE_SCHEMA} 
              onChange={(val) => updateConfig('FEATURE_COSTS', val)}
              keyLabel="Feature Internal Key (e.g. customAnimations)"
            />
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Dynamic Add-on Categories</h2>
                <p className="text-[var(--color-text-muted)] text-sm">Add and manage infrastructure dropdown options (like Hosting, Domains, etc.).</p>
              </div>
              <button 
                onClick={() => {
                  const id = prompt('Enter a unique ID for this category (e.g., marketing_tools):');
                  if (!id) return;
                  const title = prompt('Enter a display title (e.g., Marketing Tools):');
                  if (!title) return;
                  const newCategories = [...(config.ADDON_CATEGORIES || []), { id, title, options: [] }];
                  updateConfig('ADDON_CATEGORIES', newCategories);
                }}
                className="px-4 py-2 bg-[var(--color-accent-primary)] hover:bg-purple-600 text-white rounded-lg flex items-center gap-2"
              >
                + Add Category
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(config.ADDON_CATEGORIES || []).map((category: any, index: number) => (
                <div key={category.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button 
                      onClick={() => {
                        if (confirm(`Delete entire category "${category.title}"?`)) {
                          const newCategories = config.ADDON_CATEGORIES.filter((c: any) => c.id !== category.id);
                          updateConfig('ADDON_CATEGORIES', newCategories);
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-300 bg-red-400/10 rounded"
                      title="Delete Category"
                    >
                      Delete
                    </button>
                  </div>
                  <ArrayEditor 
                    title={`${category.title} Options`} 
                    value={category.options || []} 
                    schema={OPTION_SCHEMA} 
                    onChange={(val) => {
                      const newCategories = [...config.ADDON_CATEGORIES];
                      newCategories[index].options = val;
                      updateConfig('ADDON_CATEGORIES', newCategories);
                    }}
                    itemTitleKey="label"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ObjectEditor 
              title="Delivery Speeds" 
              value={config.DELIVERY_SPEEDS || {}} 
              schema={SPEED_SCHEMA} 
              onChange={(val) => updateConfig('DELIVERY_SPEEDS', val)}
              keyLabel="Speed Key (e.g. fast, standard)"
            />
            <ArrayEditor 
              title="Maintenance Options" 
              value={config.MAINTENANCE_OPTIONS || []} 
              schema={OPTION_SCHEMA} 
              onChange={(val) => updateConfig('MAINTENANCE_OPTIONS', val)}
              itemTitleKey="label"
            />
          </div>
        )}
      </div>
    </div>
  );
}
