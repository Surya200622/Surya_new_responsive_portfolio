'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PendingQuotationHandler() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const processPendingQuote = async () => {
      const pendingQuoteStr = localStorage.getItem('pendingQuote');
      if (!pendingQuoteStr) return;

      try {
        setIsProcessing(true);
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
          alert('Failed to generate quotation: ' + (errorData.error || 'Unknown error') + (errorData.details ? '\nDetails: ' + JSON.stringify(errorData.details) : ''));
          localStorage.removeItem('pendingQuote'); // Remove it anyway so we don't get stuck
        }
      } catch (error: any) {
        console.error('Error processing pending quote:', error);
        alert('Network error while processing quote: ' + error.message);
        localStorage.removeItem('pendingQuote');
      } finally {
        setIsProcessing(false);
      }
    };

    processPendingQuote();
  }, [router]);

  if (!isProcessing) return null;

  return (
    <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] flex flex-col items-center justify-center space-y-4 mb-6">
      <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
      <p className="text-[var(--color-text-primary)] font-medium">Generating your customized quotation...</p>
    </div>
  );
}
