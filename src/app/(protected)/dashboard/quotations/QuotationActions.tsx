'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QuotationActionsProps {
  quoteId: string;
  projectId: string;
  adminId: string | null;
  clientName: string;
  projectName: string;
}

export default function QuotationActions({ quoteId, projectId, adminId, clientName, projectName }: QuotationActionsProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null); // 'accept' or 'reject'
  const router = useRouter();

  const handleAction = async (action: 'accept' | 'reject') => {
    try {
      setIsProcessing(action);

      // 1. Update Quotation Status
      const res = await fetch(`/api/quotations/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, projectId })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || `Failed to ${action} quotation`;
        throw new Error(errorMsg);
      }

      // 2. Send Notification to Admin
      if (adminId) {
        const title = action === 'accept' ? 'Quotation Accepted' : 'Quotation Declined';
        const message = `${clientName} has ${action === 'accept' ? 'accepted' : 'declined'} the quotation for "${projectName}".`;
        
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: adminId,
            title,
            message,
            type: action === 'accept' ? 'success' : 'warning',
            link: `/admin/projects/${projectId}`
          })
        });
      }

      router.refresh();
    } catch (error: any) {
      console.error(`Error during quotation ${action}:`, error);
      alert(error.message || `Failed to ${action} quotation. Please try again.`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleAction('reject')}
        disabled={isProcessing !== null}
        className="btn btn--glass px-4 py-2 flex items-center gap-2 text-red-400 hover:text-red-300 hover:border-red-500/30"
      >
        {isProcessing === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle size={16} />} 
        Decline
      </button>
      
      <button 
        onClick={() => handleAction('accept')}
        disabled={isProcessing !== null}
        className="btn px-4 py-2 flex items-center gap-2 bg-[var(--color-accent-primary)] hover:brightness-110 text-[#0a0a0f]"
      >
        {isProcessing === 'accept' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={16} />} 
        Accept
      </button>
    </div>
  );
}
