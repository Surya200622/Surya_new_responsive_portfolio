'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
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
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError('');

    try {
      const validData = registerSchema.parse(formData);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Send credentials via email asynchronously
      fetch('/api/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: validData.email,
          password: validData.password,
          name: validData.fullName
        })
      }).catch(err => console.error('Failed to send credentials:', err));

      // Sign the user in
      await signIn('credentials', {
        redirect: false,
        email: validData.email,
        password: validData.password,
      });

      window.location.href = '/dashboard';
      return;
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
      <div className="w-full text-center py-8">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Check your email</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
          We've sent a verification link to <span className="text-white font-medium">{formData.email}</span>. 
          Please verify your email to access the client portal.
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
        <h1 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-2">Create Account</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Set up your client portal access</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

        <div className="mb-6">
          <button
            onClick={async () => {
              setIsLoading(true);
              setServerError('');
              try {
                await signIn('google', { callbackUrl: '/dashboard' });
              } catch (error) {
                if (error instanceof Error) setServerError(error.message);
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-glass-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>
          <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-3">
            By continuing with Google, you agree to our <Link href="/terms-of-service" className="hover:text-[var(--color-text-primary)] underline">Terms of Service</Link> and <Link href="/privacy-policy" className="hover:text-[var(--color-text-primary)] underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-glass-border)]"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="bg-[var(--color-bg-primary)] px-2 text-[var(--color-text-muted)] uppercase tracking-wider">Or continue with email</span>
          </div>
        </div>

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
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
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
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-400">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="flex items-start pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 bg-[var(--color-bg-card)] border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-accent-primary)] accent-[var(--color-accent-primary)] cursor-pointer"
            />
          </div>
          <div className="ml-3 text-xs">
            <label htmlFor="terms" className="text-[var(--color-text-muted)] cursor-pointer select-none">
              I agree to the <Link href="/terms-of-service" className="text-[var(--color-accent-primary)] hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-[var(--color-accent-primary)] hover:underline">Privacy Policy</Link>
            </label>
          </div>
        </div>

        <button type="submit" disabled={isLoading || !acceptTerms} className="gradient-btn w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4">
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
