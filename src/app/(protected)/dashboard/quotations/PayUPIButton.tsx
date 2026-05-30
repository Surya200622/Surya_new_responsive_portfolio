'use client';

import { CreditCard } from 'lucide-react';

interface PayUPIButtonProps {
  amount: number;
  projectName: string;
}

export default function PayUPIButton({ amount, projectName }: PayUPIButtonProps) {
  const handlePay = () => {
    // Generate UPI Intent URL
    const upiUrl = `upi://pay?pa=9994566325@upi&pn=Surya&am=${amount}&cu=INR&tn=${encodeURIComponent('Payment for ' + projectName)}`;
    
    // Open WhatsApp to notify Surya immediately
    const msg = `Hi Surya, I have initiated a payment of ₹${amount.toLocaleString('en-IN')} for my project quotation (${projectName}) via GPay.`;
    window.open(`https://wa.me/918220443165?text=${encodeURIComponent(msg)}`, '_blank');

    // Trigger the UPI intent for mobile apps natively
    window.location.href = upiUrl;
  };

  return (
    <button
      onClick={handlePay}
      className="btn px-3 py-2 flex items-center gap-2 text-white transition-all shadow-md hover:shadow-lg active:scale-95 border-none"
      style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)' }}
      title="Pay via GPay"
    >
      <CreditCard size={16} />
      <span className="hidden sm:inline text-sm font-semibold">Pay via GPay</span>
    </button>
  );
}
