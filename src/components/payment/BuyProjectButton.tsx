'use client';

import { useState } from 'react';
import PaymentModal from './PaymentModal';

export default function BuyProjectButton({ projectTitle, projectPrice }: { projectTitle: string, projectPrice: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract digits from projectPrice (e.g., "Starting at ₹10000" -> 10000)
  const priceNumber = projectPrice ? Number(projectPrice.replace(/[^0-9]/g, '')) : 5000;

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ display: 'block', textAlign: 'center', background: 'var(--color-accent-primary)', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, width: '100%', fontSize: '1.1rem', cursor: 'pointer', border: 'none' }}
      >
        Buy this project
      </button>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={priceNumber || 5000}
        projectName={projectTitle}
        allowAdvance={false}
        allowRemaining={false}
      />
    </>
  );
}
