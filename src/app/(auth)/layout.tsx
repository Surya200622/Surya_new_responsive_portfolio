import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Shield, Zap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#05050a] overflow-x-hidden relative">
      
      {/* Background Orbs for overall atmosphere (especially mobile) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[var(--color-accent-primary)]/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-pulse lg:hidden" style={{ animationDuration: '6s' }} />

      {/* LEFT PANEL - Image and Branding */}
      <div className="flex w-full lg:w-1/2 min-h-[45vh] lg:min-h-screen relative bg-[#0a0a0f] flex-col justify-between overflow-hidden shadow-2xl z-10">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png"
            alt="Surya CS"
            fill
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            style={{ filter: 'contrast(1.1) brightness(0.9)' }}
            priority
          />
          {/* Gradient Overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05050a]/80 via-transparent to-[#05050a]/80 z-10" />
          
          {/* Animated Orbs for atmosphere */}
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[var(--color-accent-primary)]/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col h-full justify-between p-8 md:p-12 lg:p-16">
          {/* Logo */}
          <Link href="/" className="w-fit inline-block">
            <img src="/logo.svg" alt="Surya CS Logo" className="theme-adaptive-logo" style={{ height: '52px', width: 'auto' }} />
          </Link>

          {/* Value Prop */}
          <div className="max-w-md mt-12 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <Sparkles className="h-4 w-4 text-[var(--color-accent-primary)]" />
              <span className="text-xs font-medium text-white/80 tracking-wide uppercase">Client Portal</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-4 md:mb-6">
              Where digital <span className="text-gradient">magic</span> meets measurable results.
            </h2>
            
            <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8">
              Log in to manage your projects, view live updates, access invoices, and communicate directly with me—all in one seamless, secure workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[var(--color-accent-primary)]" />
                <div className="text-sm">
                  <p className="text-white font-medium">Secure Access</p>
                  <p className="text-white/50 text-xs">Enterprise-grade</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-[var(--color-accent-warm)]" />
                <div className="text-sm">
                  <p className="text-white font-medium">Real-time Data</p>
                  <p className="text-white/50 text-xs">Live project tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Contains the authentication forms */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-[var(--color-bg-primary)] flex-1 rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0 z-20">
        {/* Subtle background effects for right panel */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0 rounded-t-3xl lg:rounded-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[50%] bg-[var(--color-accent-primary)]/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>
        
        {/* Form Container */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full w-full p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
