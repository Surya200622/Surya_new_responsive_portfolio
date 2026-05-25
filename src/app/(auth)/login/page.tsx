'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      // Validate input
      const validData = loginSchema.parse(formData);

      // Attempt login
      const { error } = await supabase.auth.signInWithPassword({
        email: validData.email,
        password: validData.password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setServerError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card-strong p-8 rounded-2xl w-full shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Sign in to access your client portal</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type="email"
              className={`auth-input pl-11 ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`auth-input pl-11 pr-11 ${errors.password ? 'border-red-500/50 focus:border-red-500' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="gradient-btn w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors font-medium">
            Create an account
          </Link>
        </p>
        
        <div className="pt-4 border-t border-[var(--color-glass-border)]">
          <Link href="/admin/login" className="text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors">
            Admin Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
