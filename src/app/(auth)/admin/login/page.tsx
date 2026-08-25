'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';




export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError('');

    try {
      const validData = loginSchema.parse(formData);

      if (validData.email !== 'cssurya2006@gmail.com') {
        throw new Error('Unauthorized admin email. Only the master admin can log in here.');
      }

      const result = await signIn('credentials', {
        redirect: false,
        email: validData.email,
        password: validData.password,
      });

      if (result?.error) throw new Error(result.error);

      router.push('/admin');
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
    <div className="glass-card-strong p-8 rounded-2xl w-full shadow-2xl relative border border-purple-500/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Portal</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Sign in to access the SaaS backend</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Admin Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type="email"
              className={`auth-input pl-11 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'focus:border-purple-500/50'}`}
              placeholder="admin@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider text-purple-400">Secret Admin Key</label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`auth-input pl-11 pr-11 border-purple-500/30 bg-purple-500/5 text-purple-100 placeholder-purple-400/30 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'focus:border-orange-500'}`}
              placeholder="Enter secret code"
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
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all text-white shadow-lg shadow-purple-500/20 border border-purple-500/50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In to Backend <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-glass-border)]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--color-bg-strong)] px-2 text-[var(--color-text-muted)]">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 bg-[var(--color-bg-glass)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] transition-colors text-[var(--color-text-primary)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-sm text-[var(--color-text-muted)]">
          Need an admin account?{' '}
          <Link href="/admin/register" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Register here
          </Link>
        </p>
        <Link href="/login" className="text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors">
          &larr; Back to Client Login
        </Link>
      </div>
    </div>
  );
}
