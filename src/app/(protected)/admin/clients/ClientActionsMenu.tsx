'use client';

import { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function ClientActionsMenu({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to completely remove this client and all their data? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client: ' + err.message);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
        disabled={isDeleting}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-glass-border)] shadow-xl z-20 overflow-hidden">
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Removing...' : 'Remove Client'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
