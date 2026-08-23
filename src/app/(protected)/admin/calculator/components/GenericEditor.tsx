'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'stringArray';
}

interface ArrayEditorProps {
  title: string;
  description?: string;
  value: any[];
  schema: SchemaField[];
  onChange: (newValue: any[]) => void;
  itemTitleKey: string;
}

export function ArrayEditor({ title, description, value = [], schema, onChange, itemTitleKey }: ArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleFieldChange = (index: number, key: string, newValue: any, type: string) => {
    const updated = [...value];
    let finalValue = newValue;
    
    if (type === 'number') {
      finalValue = newValue === '' ? 0 : Number(newValue);
    } else if (type === 'stringArray') {
      finalValue = newValue.split('\n').filter((s: string) => s.trim() !== '');
    }

    updated[index] = { ...updated[index], [key]: finalValue };
    onChange(updated);
  };

  const handleAdd = () => {
    const newItem: any = {};
    schema.forEach(field => {
      newItem[field.key] = field.type === 'number' ? 0 : field.type === 'stringArray' ? [] : '';
    });
    // Add unique ID suffix if there's an id or value field
    if (newItem.id !== undefined) newItem.id = `new_item_${Date.now()}`;
    if (newItem.value !== undefined) newItem.value = `new_val_${Date.now()}`;
    
    onChange([...value, newItem]);
    setExpandedIndex(value.length); // Expand the new item
  };

  const handleRemove = (index: number) => {
    if (confirm('Are you sure you want to remove this item?')) {
      const updated = [...value];
      updated.splice(index, 1);
      onChange(updated);
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>}
      </div>

      <div className="space-y-2">
        {value.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div key={index} className="border border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] rounded-xl overflow-hidden transition-all">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--color-bg-glass-strong)]"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {item[itemTitleKey] || `Item ${index + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-[var(--color-glass-border)] bg-[var(--color-bg-glass-strong)] grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schema.map((field) => {
                    const fieldValue = item[field.key];
                    const displayValue = field.type === 'stringArray' 
                      ? (Array.isArray(fieldValue) ? fieldValue.join('\n') : '') 
                      : (fieldValue || '');

                    return (
                      <div key={field.key} className={field.type === 'textarea' || field.type === 'stringArray' ? 'md:col-span-2' : ''}>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{field.label}</label>
                        {field.type === 'textarea' || field.type === 'stringArray' ? (
                          <textarea
                            value={displayValue}
                            onChange={(e) => handleFieldChange(index, field.key, e.target.value, field.type)}
                            className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none min-h-[80px]"
                            placeholder={field.type === 'stringArray' ? 'Enter items, one per line' : ''}
                          />
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={displayValue}
                            onChange={(e) => handleFieldChange(index, field.key, e.target.value, field.type)}
                            className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 hover:bg-[var(--color-accent-primary)]/20 rounded-xl transition-colors w-full justify-center border border-[var(--color-accent-primary)]/20"
      >
        <Plus className="w-4 h-4" />
        Add New {title.replace(/s$/, '')}
      </button>
    </div>
  );
}

interface ObjectEditorProps {
  title: string;
  description?: string;
  value: Record<string, any>;
  schema: SchemaField[];
  onChange: (newValue: Record<string, any>) => void;
  keyLabel?: string;
}

export function ObjectEditor({ title, description, value = {}, schema, onChange, keyLabel = "Identifier Key" }: ObjectEditorProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const handleFieldChange = (itemKey: string, fieldKey: string, newValue: any, type: string) => {
    const updated = { ...value };
    let finalValue = newValue;
    
    if (type === 'number') {
      finalValue = newValue === '' ? 0 : Number(newValue);
    }

    updated[itemKey] = { ...updated[itemKey], [fieldKey]: finalValue };
    onChange(updated);
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || newKey.trim() === '') return;
    if (value[newKey]) {
      alert('This key already exists!');
      return;
    }
    
    const updated = { ...value };
    updated[newKey] = updated[oldKey];
    delete updated[oldKey];
    onChange(updated);
    
    if (expandedKey === oldKey) {
      setExpandedKey(newKey);
    }
  };

  const handleAdd = () => {
    const newKey = `new_key_${Date.now()}`;
    const newItem: any = {};
    schema.forEach(field => {
      newItem[field.key] = field.type === 'number' ? 0 : '';
    });
    
    onChange({ ...value, [newKey]: newItem });
    setExpandedKey(newKey);
  };

  const handleRemove = (itemKey: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      const updated = { ...value };
      delete updated[itemKey];
      onChange(updated);
      if (expandedKey === itemKey) setExpandedKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>}
      </div>

      <div className="space-y-2">
        {Object.entries(value).map(([itemKey, item]) => {
          const isExpanded = expandedKey === itemKey;
          const displayTitle = schema.find(f => f.key === 'label' || f.key === 'name');
          const titleText = displayTitle ? item[displayTitle.key] : itemKey;

          return (
            <div key={itemKey} className="border border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] rounded-xl overflow-hidden transition-all">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--color-bg-glass-strong)]"
                onClick={() => setExpandedKey(isExpanded ? null : itemKey)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)]"></div>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {titleText || itemKey}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-bg-tertiary)] px-2 py-0.5 rounded-md border border-[var(--color-glass-border)]">{itemKey}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemove(itemKey); }}
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-[var(--color-glass-border)] bg-[var(--color-bg-glass-strong)] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{keyLabel}</label>
                    <input
                      type="text"
                      defaultValue={itemKey}
                      onBlur={(e) => handleKeyChange(itemKey, e.target.value)}
                      className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] font-mono focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none"
                    />
                  </div>
                  
                  {schema.map((field) => {
                    const fieldValue = item[field.key];
                    const displayValue = fieldValue || '';

                    return (
                      <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{field.label}</label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={displayValue}
                            onChange={(e) => handleFieldChange(itemKey, field.key, e.target.value, field.type)}
                            className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none min-h-[80px]"
                          />
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={displayValue}
                            onChange={(e) => handleFieldChange(itemKey, field.key, e.target.value, field.type)}
                            className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 hover:bg-[var(--color-accent-primary)]/20 rounded-xl transition-colors w-full justify-center border border-[var(--color-accent-primary)]/20"
      >
        <Plus className="w-4 h-4" />
        Add New {title.replace(/s$/, '')}
      </button>
    </div>
  );
}
