import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogOut, Home, MessageSquare, Briefcase, Folder, FileText, Settings, Bell } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile to check role and display name
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  console.log('--- DEBUG PROFILE FETCH ---');
  console.log('User ID:', user.id);
  console.log('Profile:', profile);
  console.log('Profile Error:', profileError);
  console.log('---------------------------');

  const isAdmin = profile?.role === 'admin';
  
  const navLinks = isAdmin ? [
    { label: 'Overview', href: '/admin', icon: Home },
    { label: 'Clients', href: '/admin/clients', icon: Briefcase },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Projects', href: '/admin/projects', icon: Folder },
  ] : [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { label: 'Projects', href: '/dashboard/projects', icon: Briefcase },
    { label: 'Files', href: '/dashboard/files', icon: Folder },
    { label: 'Quotations', href: '/dashboard/quotations', icon: FileText },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-card-strong border-r border-[var(--color-glass-border)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--color-glass-border)]">
          <Link href="/" className="text-xl font-display font-bold text-white tracking-wide hover:text-[var(--color-accent-primary)] transition-colors">
            Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
          </Link>
          <div className="mt-2 text-xs text-[var(--color-text-muted)] font-medium tracking-wider uppercase">
            {isAdmin ? 'Admin Portal' : 'Client Portal'}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-glass)] transition-all group"
            >
              <link.icon className="w-5 h-5 group-hover:text-[var(--color-accent-primary)] transition-colors" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-glass-border)]">
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass-card border-b border-[var(--color-glass-border)] flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden">
            <Link href="/" className="text-xl font-display font-bold text-white tracking-wide">
              Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-display font-semibold">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent-primary)] transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-bg-primary)]"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center font-display font-bold text-sm">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
