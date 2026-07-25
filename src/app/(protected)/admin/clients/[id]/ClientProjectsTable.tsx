'use client';

import { useState } from 'react';
import { Loader2, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  project_name?: string;
  name?: string;
  title?: string;
  status: string;
  createdAt: Date | string;
  budget?: string | number;
}

const STATUS_OPTIONS = [
  'Pending',
  'Waiting for Payment',
  'Requirements Gathering',
  'Design Phase',
  'Development Phase',
  'Testing Phase',
  'Review Phase',
  'Completed',
  'Cancelled'
];

export default function ClientProjectsTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setUpdatingId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      // Update local state
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      router.refresh(); // Refresh server components if any
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('completed')) return 'bg-green-500/10 border-green-500/30 text-green-500';
    if (s.includes('cancelled')) return 'bg-red-500/10 border-red-500/30 text-red-500';
    if (s.includes('development') || s.includes('design') || s.includes('testing')) return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    if (s.includes('payment')) return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
    return 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]';
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
        <p className="text-[var(--color-text-secondary)] font-medium">No projects yet</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Projects assigned to this client will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm text-left">
        <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
          <tr>
            <th className="px-6 py-3 rounded-tl-xl">Project Name</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3 rounded-tr-xl text-right">Budget</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
              <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                {project.project_name || project.name || project.title || 'Untitled Project'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <select
                    value={project.status || 'Pending'}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    disabled={updatingId === project.id}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border cursor-pointer outline-none appearance-none transition-colors ${getStatusColor(project.status)}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {updatingId === project.id && <Loader2 className="w-3 h-3 animate-spin text-[var(--color-text-muted)]" />}
                </div>
              </td>
              <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                {new Date(project.createdAt || Date.now()).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right text-[var(--color-text-secondary)]">
                {project.budget ? `₹${Number(project.budget).toLocaleString()}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
