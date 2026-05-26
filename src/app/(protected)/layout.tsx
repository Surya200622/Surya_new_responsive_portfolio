'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Home, MessageSquare, Briefcase, Folder, FileText, Bell, User, Settings, X, ChevronDown, Menu } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState, useRef } from 'react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  phone?: string;
  role: string;
  avatar_url?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settingsForm, setSettingsForm] = useState({ full_name: '', company_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
          setSettingsForm({
            full_name: profileData.full_name || '',
            company_name: profileData.company_name || '',
            phone: profileData.phone || '',
          });

          // If admin is on /dashboard, redirect to /admin
          if (profileData.role === 'admin' && pathname?.startsWith('/dashboard')) {
            router.push('/admin');
          }
        } else {
          // Fallback: use auth user metadata when profile query fails (e.g. RLS recursion)
          console.warn('Profile fetch failed:', profileError?.message);
          const meta = user.user_metadata;
          const fallbackRole = meta?.role || 'client';
          const fallbackProfile: Profile = {
            id: user.id,
            full_name: meta?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            company_name: meta?.company_name || '',
            phone: meta?.phone || '',
            role: fallbackRole,
          };
          setProfile(fallbackProfile);
          setIsAdmin(fallbackRole === 'admin');
          setSettingsForm({
            full_name: fallbackProfile.full_name,
            company_name: fallbackProfile.company_name || '',
            phone: fallbackProfile.phone || '',
          });

          if (fallbackRole === 'admin' && pathname?.startsWith('/dashboard')) {
            router.push('/admin');
          }
        }

        // Fetch notifications (silently fail if table has issues)
        try {
          const { data: notifs } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (notifs) {
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.is_read).length);
          }
        } catch (e) {
          console.warn('Notifications fetch failed:', e);
        }
      } catch (e) {
        console.error('Layout load error:', e);
        router.push('/login');
        return;
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleMarkAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: settingsForm.full_name,
        company_name: settingsForm.company_name || null,
        phone: settingsForm.phone || null,
      })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...settingsForm } : prev);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setSaving(false);
  };

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
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-card-strong border-r border-[var(--color-glass-border)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--color-glass-border)]">
          <Link href="/" className="text-xl font-display font-bold text-[var(--color-text-primary)] tracking-wide hover:text-[var(--color-accent-primary)] transition-colors">
            Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
          </Link>
          <div className="mt-2 text-xs text-[var(--color-text-muted)] font-medium tracking-wider uppercase">
            {isAdmin ? 'Admin Portal' : 'Client Portal'}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)]'
                }`}
              >
                <link.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--color-accent-primary)]' : 'group-hover:text-[var(--color-accent-primary)]'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-glass-border)]">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <aside className="relative w-64 max-w-[80%] bg-[var(--color-bg-primary)] border-r border-[var(--color-glass-border)] flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-[var(--color-glass-border)] flex items-center justify-between">
              <div>
                <Link href="/" className="text-xl font-display font-bold text-[var(--color-text-primary)] tracking-wide">
                  Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
                </Link>
                <div className="mt-2 text-xs text-[var(--color-text-muted)] font-medium tracking-wider uppercase">
                  {isAdmin ? 'Admin Portal' : 'Client Portal'}
                </div>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)]'
                    }`}
                  >
                    <link.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--color-accent-primary)]' : 'group-hover:text-[var(--color-accent-primary)]'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[var(--color-glass-border)]">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-[var(--color-glass-border)] flex items-center justify-between px-6 shrink-0 relative z-50" style={{ background: 'var(--color-bg-glass)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}>
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-display font-bold text-[var(--color-text-primary)] tracking-wide">
              Surya CS<span className="text-[var(--color-accent-primary)]">.</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="w-10 h-10 rounded-full bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)] transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--color-bg-primary)]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 glass-card-strong rounded-2xl border border-[var(--color-glass-border)] shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-[var(--color-glass-border)]">
                    <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors ${!notif.is_read ? 'bg-[var(--color-accent-primary)]/5' : ''}`}>
                          <div className="flex items-start gap-3">
                            {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] mt-1.5 shrink-0" />}
                            <div className={!notif.is_read ? '' : 'ml-5'}>
                              <p className="text-sm font-medium text-[var(--color-text-primary)]">{notif.title}</p>
                              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{notif.message}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)] mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-text-secondary)]">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5">
                  <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center font-display font-bold text-sm text-[var(--color-text-primary)]">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-64 glass-card-strong rounded-2xl border border-[var(--color-glass-border)] shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-[var(--color-glass-border)]">
                    <p className="text-sm font-display font-bold text-[var(--color-text-primary)]">{profile?.full_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{profile?.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]">
                      {profile?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-[var(--color-glass-border)]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="glass-card-strong rounded-2xl border border-[var(--color-glass-border)] w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-glass-border)]">
              <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)]">Account Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="w-8 h-8 rounded-full bg-[var(--color-bg-glass)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                  <input
                    type="text"
                    className="auth-input pl-11"
                    value={settingsForm.full_name}
                    onChange={e => setSettingsForm({ ...settingsForm, full_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-[var(--color-text-muted)]" /></div>
                  <input type="email" className="auth-input pl-11 opacity-50 cursor-not-allowed" value={profile?.email || ''} disabled />
                </div>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Email cannot be changed.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Company</label>
                  <input
                    type="text"
                    className="auth-input px-4"
                    value={settingsForm.company_name}
                    onChange={e => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    className="auth-input px-4"
                    value={settingsForm.phone}
                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-[var(--color-glass-border)]">
              {saveSuccess && <p className="text-sm text-green-400 font-medium">✓ Saved successfully!</p>}
              {!saveSuccess && <div />}
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
