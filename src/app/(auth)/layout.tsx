import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background elements matching the portfolio aesthetic */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/surya-cinematic.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/90 via-[#0a0a0f]/80 to-[#0a0a0f]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[var(--color-accent-primary)]/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-[var(--color-accent-warm)]/10 rounded-full blur-[80px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="text-xl font-display font-bold text-white tracking-wide hover:text-[var(--color-accent-primary)] transition-colors">
          Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {children}
      </div>
    </div>
  );
}
