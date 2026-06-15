'use client';

import { useState } from 'react';
import { X, CreditCard, Copy, CheckCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  projectName: string;
  projectId?: string;
  quotationId?: string;
  referenceCode?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  projectName,
  projectId,
  quotationId,
  referenceCode = 'PENDING-REF'
}: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'advance' | 'remaining' | 'full'>('full');
  const [step, setStep] = useState<'options' | 'qr' | 'confirm'>('options');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate amounts
  const advanceAmount = Math.round(amount * 0.2); // 20% advance
  const remainingAmount = amount - advanceAmount; // 80% remaining
  const fullAmount = amount; // 100% full payment
  
  let payAmount = fullAmount;
  if (paymentType === 'advance') payAmount = advanceAmount;
  if (paymentType === 'remaining') payAmount = remainingAmount;

  // UPI Details
  const upiId = 'cssurya2006@okicici';
  const payeeName = 'C.S. SURYA';
  const note = `Payment for ${projectName} (${referenceCode})`;
  
  // Construct dynamic UPI URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${payAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  
  // Generate QR code dynamically using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIvePaidClick = () => {
    setStep('confirm');
  };

  const handleSubmitTransaction = () => {
    // Here we would normally save to database (Supabase payments table)
    // For now, we will open WhatsApp
    
    const msg = `Hi Surya,
    
I have paid ₹${payAmount.toLocaleString('en-IN')} for ${projectName}.
Reference: ${referenceCode}
Type: ${paymentType === 'advance' ? 'Advance Payment (20%)' : paymentType === 'remaining' ? 'Remaining Balance (80%)' : 'Full Payment (100%)'}

Transaction ID:
${transactionId || '__________'}

Please verify the payment.`;

    window.open(`https://wa.me/918220443165?text=${encodeURIComponent(msg)}`, '_blank');
    
    // Close modal after redirecting
    setTimeout(() => onClose(), 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[var(--color-bg-primary)] border border-[var(--color-glass-border)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] relative"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-[var(--color-accent-primary)] opacity-10 blur-3xl pointer-events-none rounded-full" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-secondary)]">
          <h2 className="font-display font-bold text-lg text-[var(--color-text-primary)]">
            Complete Payment
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          {step === 'options' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">Select your payment preference for <strong>{projectName}</strong></p>
                
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentType === 'advance' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentType" 
                        checked={paymentType === 'advance'}
                        onChange={() => setPaymentType('advance')}
                        className="w-4 h-4 accent-[var(--color-accent-primary)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">Pay Advance (20%)</p>
                        <p className="text-xs text-[var(--color-text-muted)]">To start the project</p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)]">₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentType === 'remaining' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentType" 
                        checked={paymentType === 'remaining'}
                        onChange={() => setPaymentType('remaining')}
                        className="w-4 h-4 accent-[var(--color-accent-primary)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">Pay Remaining (80%)</p>
                        <p className="text-xs text-[var(--color-text-muted)]">If advance is already paid</p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)]">₹{remainingAmount.toLocaleString('en-IN')}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentType === 'full' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentType" 
                        checked={paymentType === 'full'}
                        onChange={() => setPaymentType('full')}
                        className="w-4 h-4 accent-[var(--color-accent-primary)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">Pay Full Amount (100%)</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Clear all dues at once</p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)]">₹{fullAmount.toLocaleString('en-IN')}</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={() => setStep('qr')}
                className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))' }}
              >
                Continue to Pay ₹{payAmount.toLocaleString('en-IN')}
              </button>
            </div>
          )}

          {step === 'qr' && (
            <div className="space-y-6 flex flex-col items-center animate-in slide-in-from-right-4">
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">Scan QR Code using any UPI App</p>
                <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mt-2">
                  ₹{payAmount.toLocaleString('en-IN')}
                </h3>
              </div>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white p-4 rounded-2xl border-4 border-[var(--color-bg-secondary)] shadow-xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 opacity-10 bg-gradient-to-tr from-[var(--color-accent-primary)] via-transparent to-[var(--color-accent-secondary)]"
                />
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 object-contain relative z-10 rounded-lg"
                />
              </motion.div>

              <div className="w-full bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-glass-border)] space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)]">Payee Name</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{payeeName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)]">UPI ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-text-primary)]">{upiId}</span>
                    <button 
                      onClick={() => copyToClipboard(upiId)}
                      className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
                      title="Copy UPI ID"
                    >
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--color-glass-border)]">
                  <span className="text-[var(--color-text-muted)]">Reference</span>
                  <span className="font-mono text-xs text-[var(--color-text-primary)]">{referenceCode}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => setStep('options')}
                  className="flex-1 py-3 rounded-xl font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] border border-[var(--color-glass-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleIvePaidClick}
                  className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 bg-green-500 hover:bg-green-600"
                >
                  I've Paid
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)]">
                  Payment Submitted?
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  Please provide your transaction ID and notify us via WhatsApp to verify your payment.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Transaction ID / UTR Number</label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 31234567890"
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-glass-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]"
                />
              </div>

              <button 
                onClick={handleSubmitTransaction}
                className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#25D366' }} // WhatsApp Green
              >
                <MessageSquare size={18} />
                Verify via WhatsApp
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
