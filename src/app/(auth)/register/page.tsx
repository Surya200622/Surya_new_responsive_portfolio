'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { User, Mail, Building, Phone, Lock, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterInput>({
    fullName: '', email: '', companyName: '', phone: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError('');

    try {
      const validData = registerSchema.parse(formData);

      const { data, error } = await supabase.auth.signUp({
        email: validData.email,
        password: validData.password,
        options: {
          data: {
            full_name: validData.fullName,
            company_name: validData.companyName,
            phone: validData.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;

      // If the user was auto-confirmed (Supabase setting), sign them in directly
      if (data.user && data.session) {
        window.location.href = '/dashboard';
        return;
      }
      
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setServerError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-card-strong p-8 rounded-2xl w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Check your email</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          We've sent a verification link to <span className="text-white font-medium">{formData.email}</span>. 
          Please verify your email to access the client portal.
        </p>
        <Link href="/login" className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] text-sm font-medium transition-colors">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card-strong p-8 rounded-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Set up your client portal access</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields mapped directly from schema */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="text" className={`auth-input pl-9 py-2.5 text-sm ${errors.fullName ? 'border-red-500/50' : ''}`} placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} disabled={isLoading} />
            </div>
            {errors.fullName && <p className="mt-1 text-[10px] text-red-400">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="email" className={`auth-input pl-9 py-2.5 text-sm ${errors.email ? 'border-red-500/50' : ''}`} placeholder="john@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isLoading} />
            </div>
            {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Company (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="text" className="auth-input pl-9 py-2.5 text-sm" placeholder="Acme Inc." value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} disabled={isLoading} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Phone (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type="tel" className="auth-input pl-9 py-2.5 text-sm" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type={showPassword ? 'text' : 'password'} className={`auth-input pl-9 pr-9 py-2.5 text-sm ${errors.password ? 'border-red-500/50' : ''}`} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors">
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-[10px] text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></div>
              <input type={showConfirmPassword ? 'text' : 'password'} className={`auth-input pl-9 pr-9 py-2.5 text-sm ${errors.confirmPassword ? 'border-red-500/50' : ''}`} placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} disabled={isLoading} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors">
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-400">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="gradient-btn w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
