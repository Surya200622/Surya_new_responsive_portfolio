'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function PendingQuotationHandler() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const processPendingQuote = async () => {
    const pendingQuoteStr = localStorage.getItem('pendingQuote');
    if (!pendingQuoteStr) return;

    try {
      setIsProcessing(true);
      setError(null);
      const quoteData = JSON.parse(pendingQuoteStr);
      
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (response.ok) {
        // Clear it so we don't process it again
        localStorage.removeItem('pendingQuote');
        window.location.reload(); // Hard reload to guarantee data shows up
      } else {
        const errorData = await response.json();
        console.error('Failed to create quotation:', errorData);
        const errorMsg = errorData.error || 'Unknown error occurred while generating quotation.';
        setError(errorMsg);
        localStorage.removeItem('pendingQuote'); // Remove it so we don't get stuck
      }
    } catch (err: any) {
      console.error('Error processing pending quote:', err);
      setError(err.message || 'Network error while processing quotation.');
      localStorage.removeItem('pendingQuote');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processPendingQuote();
  }, [router]);

  if (!isProcessing && !error) return null;

  return (
    <div className={`glass-card-strong p-6 rounded-2xl border flex flex-col items-center justify-center space-y-4 mb-6 ${
      error 
        ? 'border-red-500/30 bg-red-500/5' 
        : 'border-[var(--color-glass-border)]'
    }`}>
      {isProcessing ? (
        <>
          <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
          <p className="text-[var(--color-text-primary)] font-medium">Generating your customized quotation...</p>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-8 h-8 text-red-400" />
          <div className="text-center">
            <p className="text-red-400 font-medium mb-1">Failed to generate quotation</p>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              router.refresh();
            }}
            className="btn btn--glass px-4 py-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <RefreshCw className="w-4 h-4" />
            Dismiss
          </button>
        </>
      ) : null}
    </div>
  );
}
