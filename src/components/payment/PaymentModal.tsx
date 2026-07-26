'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  allowAdvance?: boolean;
  allowRemaining?: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  projectName,
  projectId,
  quotationId,
  referenceCode = 'PENDING-REF',
  allowAdvance = true,
  allowRemaining = true
}: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'advance' | 'remaining' | 'full'>('full');
  const [step, setStep] = useState<'options' | 'qr' | 'confirm'>('options');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [completedPayments, setCompletedPayments] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && projectName) {
      setStep('options');
      setTransactionId('');
      const saved = localStorage.getItem(`payment_${projectName}`);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        setCompletedPayments(parsed);
        if (parsed.includes('full') || parsed.includes('remaining') || (parsed.includes('advance') && !allowRemaining)) {
          // No default needed, will show completed state
        } else if (parsed.includes('advance') && allowRemaining) {
          setPaymentType('remaining');
        } else {
          setPaymentType(allowAdvance ? 'advance' : 'full');
        }
      } else {
        setCompletedPayments([]);
        setPaymentType(allowAdvance ? 'advance' : 'full');
      }
    }
  }, [isOpen, projectName]);

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

  const handleContinueToPay = () => {
    // Check if the user is on a mobile or tablet device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Automatically redirect to default UPI apps
      window.location.href = upiUrl;
    }
    
    // Always proceed to the next step so they can confirm payment afterwards
    setStep('qr');
  };

  const handleIvePaidClick = () => {
    setStep('confirm');
  };

  const handleSubmitTransaction = async () => {
    // Save to local storage
    const newPayments = [...completedPayments, paymentType];
    setCompletedPayments(newPayments);
    localStorage.setItem(`payment_${projectName}`, JSON.stringify(newPayments));
    
    // Automatically update the database if we have a quotation ID
    if (quotationId && projectId) {
      try {
        await fetch(`/api/quotations/${quotationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'pay',
            paymentType,
            transactionId,
            projectId
          }),
        });
      } catch (err) {
        console.error('Failed to update payment status automatically:', err);
      }
    }
    
    // Open WhatsApp for verification
    
    const msg = `Hi Surya,
    
I have paid ₹${payAmount.toLocaleString('en-IN')} for ${projectName}.
Reference: ${referenceCode}
Type: ${paymentType === 'advance' ? 'Advance Payment (20%)' : paymentType === 'remaining' ? 'Remaining Balance (80%)' : 'Full Payment (100%)'}

Transaction ID:
${transactionId || '__________'}

*[Please find the payment screenshot attached below]*

Please verify the payment.`;

    window.open(`https://wa.me/918220443165?text=${encodeURIComponent(msg)}`, '_blank');
    
    // Close modal after redirecting
    setTimeout(() => onClose(), 1000);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
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
        <div className="p-4 sm:p-6 overflow-y-auto">
          
          {step === 'options' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">Select your payment preference for <strong>{projectName}</strong></p>
                
                {(completedPayments.includes('full') || completedPayments.includes('remaining') || (completedPayments.includes('advance') && !allowRemaining)) ? (
                  <div className="p-6 text-center border border-green-500/20 bg-green-500/10 rounded-xl">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-500">Payment Processed</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2">Your payment request is being processed. Please wait for admin verification or manage your project from your dashboard.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allowAdvance && !completedPayments.includes('advance') && (
                      <label className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 sm:gap-0 rounded-xl border cursor-pointer transition-all ${paymentType === 'advance' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                        <div className="flex items-start sm:items-center gap-3">
                          <input 
                            type="radio" 
                            name="paymentType" 
                            checked={paymentType === 'advance'}
                            onChange={() => setPaymentType('advance')}
                            className="w-4 h-4 mt-1 sm:mt-0 accent-[var(--color-accent-primary)] shrink-0"
                          />
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">Pay Advance (20%)</p>
                            <p className="text-xs text-[var(--color-text-muted)]">To start the project</p>
                          </div>
                        </div>
                        <span className="font-bold text-[var(--color-text-primary)] sm:text-right w-full sm:w-auto ml-7 sm:ml-0">₹{advanceAmount.toLocaleString('en-IN')}</span>
                      </label>
                    )}

                    {allowRemaining && completedPayments.includes('advance') && (
                      <label className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 sm:gap-0 rounded-xl border cursor-pointer transition-all ${paymentType === 'remaining' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                        <div className="flex items-start sm:items-center gap-3">
                          <input 
                            type="radio" 
                            name="paymentType" 
                            checked={paymentType === 'remaining'}
                            onChange={() => setPaymentType('remaining')}
                            className="w-4 h-4 mt-1 sm:mt-0 accent-[var(--color-accent-primary)] shrink-0"
                          />
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">Pay Remaining (80%)</p>
                            <p className="text-xs text-[var(--color-text-muted)]">If advance is already paid</p>
                          </div>
                        </div>
                        <span className="font-bold text-[var(--color-text-primary)] sm:text-right w-full sm:w-auto ml-7 sm:ml-0">₹{remainingAmount.toLocaleString('en-IN')}</span>
                      </label>
                    )}

                    {!completedPayments.includes('advance') && (
                      <label className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 sm:gap-0 rounded-xl border cursor-pointer transition-all ${paymentType === 'full' ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10' : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'}`}>
                        <div className="flex items-start sm:items-center gap-3">
                          <input 
                            type="radio" 
                            name="paymentType" 
                            checked={paymentType === 'full'}
                            onChange={() => setPaymentType('full')}
                            className="w-4 h-4 mt-1 sm:mt-0 accent-[var(--color-accent-primary)] shrink-0"
                          />
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">Pay Full Amount (100%)</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Clear all dues at once</p>
                          </div>
                        </div>
                        <span className="font-bold text-[var(--color-text-primary)] sm:text-right w-full sm:w-auto ml-7 sm:ml-0">₹{fullAmount.toLocaleString('en-IN')}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              {!(completedPayments.includes('full') || completedPayments.includes('remaining') || (completedPayments.includes('advance') && !allowRemaining)) && (
                <button 
                  onClick={handleContinueToPay}
                  className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))' }}
                >
                  Continue to Pay ₹{payAmount.toLocaleString('en-IN')}
                </button>
              )}
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
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-green-500/20 rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-2 bg-green-500/20 rounded-full"
                  />
                  <div className="relative w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] z-10">
                    <motion.svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8"
                    >
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, type: "tween" }}
                        d="M20 6L9 17l-5-5"
                      />
                    </motion.svg>
                  </div>
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
                  Payment Submitted?
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  Please provide your transaction ID below. When WhatsApp opens, <strong>don't forget to attach your payment screenshot!</strong>
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
    </AnimatePresence>,
    document.body
  );
}
