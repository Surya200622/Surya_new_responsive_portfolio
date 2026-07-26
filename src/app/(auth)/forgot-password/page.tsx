'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';




export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordInput>({ email: '' });
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setServerError('');

    try {
      const validData = forgotPasswordSchema.parse(formData);

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: validData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }
      
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-8">
        <div className="w-16 h-16 bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-[var(--color-accent-primary)]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-3">Check your email</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
          If an account exists for <span className="text-[var(--color-text-primary)] font-medium">{formData.email}</span>, 
          you will receive a password reset link shortly.
        </p>
        <Link href="/login" className="btn btn--primary w-full justify-center">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">

      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-2">Reset Password</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Enter your email to receive a reset link</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type="email"
              className={`auth-input pl-11 ${error ? 'border-red-500/50' : ''}`}
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              disabled={isLoading}
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="gradient-btn w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
