'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import PaymentModal from '@/components/payment/PaymentModal';

interface PayUPIButtonProps {
  amount: number;
  projectName: string;
  projectId?: string;
  quotationId?: string;
  referenceCode?: string;
}

export default function PayUPIButton({ 
  amount, 
  projectName,
  projectId,
  quotationId,
  referenceCode 
}: PayUPIButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn px-3 py-2 flex items-center gap-2 text-white transition-all shadow-md hover:shadow-lg active:scale-95 border-none"
        style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)' }}
        title="Pay securely via UPI"
      >
        <CreditCard size={16} />
        <span className="hidden sm:inline text-sm font-semibold">Pay securely</span>
      </button>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={amount}
        projectName={projectName}
        projectId={projectId}
        quotationId={quotationId}
        referenceCode={referenceCode}
      />
    </>
  );
}
