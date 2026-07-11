'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Surya CS',
};


export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordInput>({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
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
      const validData = resetPasswordSchema.parse(formData);

      const { error } = await supabase.auth.updateUser({
        password: validData.password,
      });

      if (error) throw error;
      
      // Successfully updated password, redirect to login
      router.push('/login?message=Password updated successfully');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setServerError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card-strong p-8 rounded-2xl w-full shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-2">Create New Password</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Please enter your new password below</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`auth-input pl-11 pr-11 ${errors.password ? 'border-red-500/50' : ''}`}
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

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`auth-input pl-11 pr-11 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="gradient-btn w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update Password <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </div>
  );
}
