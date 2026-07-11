'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
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

      // Enforce the specific admin email
      if (validData.email !== 'cssurya2006@gmail.com') {
        throw new Error('Unauthorized admin email. Only the master admin can log in here.');
      }

      // Attempt login
      const { error } = await supabase.auth.signInWithPassword({
        email: validData.email,
        password: validData.password,
      });

      if (error) throw error;

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
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Password</label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`auth-input pl-11 pr-11 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'focus:border-purple-500/50'}`}
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
