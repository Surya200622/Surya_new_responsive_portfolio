'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, MessageSquare, IndianRupee, Calculator, Loader2, Megaphone, Save, Mail, BarChart3 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  // Fallback if users table doesn't have created_at
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculatorEnabled, setCalculatorEnabled] = useState(true);
  const [calculatorToggling, setCalculatorToggling] = useState(false);

  const [bannerSettings, setBannerSettings] = useState({ 
    text: 'Meet Jarvis AI — Experience the next generation of AI assistance. Boost your productivity and streamline your workflow with Jarvis!', 
    url: 'https://surya-cs.itch.io/jarvis', 
    buttonText: 'Try Jarvis Now',
    active: true 
  });
  const [bannerSaving, setBannerSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (status === 'loading') return;
      if (status === 'unauthenticated' || !session?.user) {
        router.push('/login'); 
        return;
      }
      
      // @ts-ignore
      if (session.user.role !== 'admin') {
        router.push('/dashboard'); 
        return;
      }

      try {
        const res = await fetch('/api/admin/summary');
        if (res.ok) {
          const data = await res.json();
          setClientCount(data.clientCount || 0);
          setProjectCount(data.projectCount || 0);
          setUnreadCount(data.unreadCount || 0);
          setRevenue(data.revenue || 0);
          setSubscriberCount(data.subscriberCount || 0);
          setRecentClients(data.recentClients || []);
        }

        // Fetch calculator toggle state
        try {
          const resSettings = await fetch('/api/admin/settings?key=calculator_enabled');
          const settingData = await resSettings.json();
          setCalculatorEnabled(settingData.value === true || settingData.value === 'true');
        } catch {
          console.warn('Failed to fetch calculator setting');
        }

        // Fetch banner settings
        try {
          const resSettings = await fetch('/api/admin/settings?key=banner_settings');
          const settingData = await resSettings.json();
          if (settingData.value && typeof settingData.value === 'object') {
            setBannerSettings(settingData.value);
          }
        } catch {
          console.warn('Failed to fetch banner setting');
        }
      } catch (e) {
        console.warn('Admin data load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [status, session, router]);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Total Clients</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{clientCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Active Projects</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{projectCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Unread Msgs</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{unreadCount}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Revenue (Est)</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">₹{revenue.toLocaleString('en-IN')}</h3>
        </div>

        <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Subscribers</p>
          </div>
          <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)]">{subscriberCount}</h3>
        </div>



      {/* Site Controls */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-lg font-display font-bold text-[var(--color-text-primary)] mb-5">Site Controls</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] group hover:border-[var(--color-accent-primary)]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${calculatorEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <Calculator className={`w-5 h-5 transition-colors duration-300 ${calculatorEnabled ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Pricing Calculator</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {calculatorEnabled ? 'Visible on the public site' : 'Hidden from the public site'}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              setCalculatorToggling(true);
              const newValue = !calculatorEnabled;
              try {
                const res = await fetch('/api/admin/settings', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ key: 'calculator_enabled', value: newValue }),
                });
                if (res.ok) {
                  setCalculatorEnabled(newValue);
                }
              } catch (e) {
                console.error('Toggle failed:', e);
              }
              setCalculatorToggling(false);
            }}
            disabled={calculatorToggling}
            className="relative shrink-0 cursor-pointer disabled:cursor-wait"
            aria-label={calculatorEnabled ? 'Disable pricing calculator' : 'Enable pricing calculator'}
          >
            {calculatorToggling ? (
              <div className="w-[52px] h-[28px] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : (
              <div className={`w-[52px] h-[28px] rounded-full transition-colors duration-300 ${calculatorEnabled ? 'bg-emerald-500' : 'bg-[var(--color-bg-tertiary)]'}`}>
                <div className={`w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 mt-[2px] ${calculatorEnabled ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4 rounded-xl bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${bannerSettings.active ? 'bg-purple-500/20' : 'bg-[var(--color-bg-tertiary)]'}`}>
                <Megaphone className={`w-5 h-5 transition-colors duration-300 ${bannerSettings.active ? 'text-purple-400' : 'text-[var(--color-text-muted)]'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Global Ad Banner</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Scrolling banner displayed on top</p>
              </div>
            </div>
            
            <button
              onClick={() => setBannerSettings(s => ({ ...s, active: !s.active }))}
              className="relative shrink-0 cursor-pointer"
            >
              <div className={`w-[52px] h-[28px] rounded-full transition-colors duration-300 ${bannerSettings.active ? 'bg-emerald-500' : 'bg-[var(--color-bg-tertiary)]'}`}>
                <div className={`w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 mt-[2px] ${bannerSettings.active ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
              </div>
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <input 
              type="text" 
              value={bannerSettings.text}
              onChange={(e) => setBannerSettings(s => ({ ...s, text: e.target.value }))}
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
              placeholder="Banner Text"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={bannerSettings.url}
                onChange={(e) => setBannerSettings(s => ({ ...s, url: e.target.value }))}
                className="flex-[2] w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                placeholder="Banner Link URL (e.g. https://... or /offers)"
              />
              <input 
                type="text" 
                value={bannerSettings.buttonText || ''}
                onChange={(e) => setBannerSettings(s => ({ ...s, buttonText: e.target.value }))}
                className="flex-1 w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                placeholder="Button Text"
              />
              <button
                onClick={async () => {
                  setBannerSaving(true);
                  try {
                    await fetch('/api/admin/settings', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ key: 'banner_settings', value: bannerSettings }),
                    });
                  } catch (e) {
                    console.error('Banner save failed:', e);
                  }
                  setBannerSaving(false);
                }}
                disabled={bannerSaving}
                className="w-full sm:w-auto bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 text-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                {bannerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Resume Updater */}
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-[var(--color-bg-glass)] border border-[var(--color-glass-border)] mt-4">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20`}>
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Resume Updater</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Upload a new PDF to update your resume across the site.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="file" 
              accept=".pdf"
              id="resume-upload"
              className="flex-1 w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[var(--color-accent-primary)] file:text-[var(--color-bg-primary)] hover:file:bg-[var(--color-accent-primary)]/90 outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
            <button
              onClick={async () => {
                const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
                if (!fileInput.files || fileInput.files.length === 0) {
                  alert('Please select a PDF file first');
                  return;
                }
                const file = fileInput.files[0];
                
                setResumeUploading(true);
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('bucket', 'resume');
                  formData.append('path', 'SuryaCS-resume');
                  
                  const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  
                  if (!uploadRes.ok) throw new Error('Upload failed');
                  const uploadData = await uploadRes.json();
                  
                  if (uploadData.url) {
                    await fetch('/api/admin/settings', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ key: 'resume_url', value: uploadData.url }),
                    });
                    alert('Resume updated successfully!');
                    fileInput.value = '';
                  }
                } catch (e) {
                  console.error('Resume upload failed:', e);
                  alert('Failed to update resume');
                }
                setResumeUploading(false);
              }}
              disabled={resumeUploading}
              className="w-full sm:w-auto bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 text-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-wait"
            >
              {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Upload & Update
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Recent Signups</h2>
          <Link href="/admin/clients" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Client</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3 rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client) => (
                <tr key={client.id} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] p-0.5">
                      <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-xs text-[var(--color-text-primary)]">
                        {client.name?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                    </div>
                    {client.name || 'Unnamed Client'}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{client.companyName || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] font-medium">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
