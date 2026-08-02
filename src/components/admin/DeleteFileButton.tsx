'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteFileButtonProps {
  id: string;
  type: 'project_file' | 'chat_attachment';
}

export default function DeleteFileButton({ id, type }: DeleteFileButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/files?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to delete file: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
      title="Delete File Permanently"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
