'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { User, Mail, Lock, Loader2, ArrowRight, ShieldAlert, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';




export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', secretKey: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError('');

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email !== 'cssurya2006@gmail.com') newErrors.email = 'Unauthorized admin email address';
    if (formData.secretKey !== 'SURYA_ADMIN_SECURE') newErrors.secretKey = 'Invalid admin secret key';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.secretKey,
          confirmPassword: formData.secretKey,
          secretKey: formData.secretKey
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setShowOtp(true);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otp.join('') }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Sign the user in immediately
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.secretKey,
      });
      
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtp) {
    if (isSuccess) {
      return (
        <div className="glass-card-strong p-8 rounded-2xl w-full text-center border border-purple-500/20">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <CheckCircle2 className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Admin Account Created</h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">
            Your admin account for <span className="text-white font-medium">{formData.email}</span> has been created.
          </p>
          <Link href="/admin/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            Proceed to Admin Login
          </Link>
        </div>
      );
    }

    return (
      <div className="glass-card-strong p-8 rounded-2xl w-full text-center border border-purple-500/20 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-2xl" />
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
          <Mail className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Verify your email</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
          We've sent a 4-digit PIN to <span className="text-white font-medium">{formData.email}</span>. 
          Please enter it below to complete your setup.
        </p>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider text-center text-purple-400">4-Digit PIN</label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className="auth-input w-12 h-14 text-center text-2xl font-bold rounded-xl border-purple-500/30 bg-purple-500/5 text-purple-100 placeholder-purple-400/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  value={otp[index]}
                  disabled={isLoading}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (!val && e.target.value !== '') return;
                    
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);

                    if (val && index < 3) {
                      otpRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  required
                />
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading || otp.join('').length !== 4} className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all text-white shadow-lg shadow-purple-500/20 border border-purple-500/50">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify & Create Admin <CheckCircle2 className="h-4 w-4" /></>}
          </button>
        </form>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-purple-400 transition-colors"
        >
          Didn't receive the email? Resend PIN
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card-strong p-8 rounded-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar border border-purple-500/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Setup</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Create a secure master account</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="text" className={`auth-input pl-9 py-2.5 text-sm ${errors.fullName ? 'border-red-500/50' : 'focus:border-orange-500'}`} placeholder="Admin Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} disabled={isLoading} />
            </div>
            {errors.fullName && <p className="mt-1 text-[10px] text-red-400">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="email" className={`auth-input pl-9 py-2.5 text-sm ${errors.email ? 'border-red-500/50' : 'focus:border-orange-500'}`} placeholder="admin@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isLoading} />
            </div>
            {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider text-purple-400">Secret Admin Key</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><KeyRound className="h-3.5 w-3.5 text-purple-400/50" /></div>
            <input type={showSecretKey ? 'text' : 'password'} className={`auth-input pl-9 pr-9 py-2.5 text-sm border-purple-500/30 bg-purple-500/5 text-purple-100 placeholder-purple-400/30 ${errors.secretKey ? 'border-red-500/50' : 'focus:border-orange-500'}`} placeholder="Enter secret code" value={formData.secretKey} onChange={e => setFormData({...formData, secretKey: e.target.value})} disabled={isLoading} />
            <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors">
              {showSecretKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {errors.secretKey && <p className="mt-1 text-[10px] text-red-400">{errors.secretKey}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all text-white shadow-lg shadow-purple-500/20 border border-purple-500/50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Admin Account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Already have an admin account?{' '}
          <Link href="/admin/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
