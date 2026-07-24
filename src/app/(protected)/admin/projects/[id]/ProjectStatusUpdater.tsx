'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, ChevronDown } from 'lucide-react';

interface ProjectStatusUpdaterProps {
  projectId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: 'text-orange-500 bg-orange-500/10' },
  { value: 'Waiting for Payment', label: 'Waiting for Payment', color: 'text-amber-500 bg-amber-500/10' },
  { value: 'Requirements Gathering', label: 'Requirements Gathering', color: 'text-yellow-500 bg-yellow-500/10' },
  { value: 'Design Phase', label: 'Design Phase', color: 'text-indigo-500 bg-indigo-500/10' },
  { value: 'Development Phase', label: 'Development Phase', color: 'text-blue-500 bg-blue-500/10' },
  { value: 'Testing Phase', label: 'Testing Phase', color: 'text-cyan-500 bg-cyan-500/10' },
  { value: 'Review Phase', label: 'Review Phase', color: 'text-purple-500 bg-purple-500/10' },
  { value: 'Completed', label: 'Completed', color: 'text-green-500 bg-green-500/10' },
  { value: 'Cancelled', label: 'Cancelled', color: 'text-red-500 bg-red-500/10' }
];

export default function ProjectStatusUpdater({ projectId, currentStatus }: ProjectStatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      router.refresh();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-transparent hover:border-[var(--color-glass-border)] transition-colors ${currentOption.color}`}
      >
        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : currentOption.label}
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full mt-2 right-0 md:left-0 z-20 w-56 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-primary)] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1 max-h-64 overflow-y-auto custom-scrollbar">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleUpdateStatus(option.value)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentStatus === option.value 
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-medium' 
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[1]}`} />
                    {option.label}
                  </div>
                  {currentStatus === option.value && <Check className="w-4 h-4 text-[var(--color-accent-primary)]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
