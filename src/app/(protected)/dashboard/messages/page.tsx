import { createClient } from '@/lib/supabase/server';
import ChatWindow from '@/components/chat/ChatWindow';

export default async function ClientMessagesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the admin user ID so messages go to the right person
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('role', 'admin')
    .limit(1)
    .single();

  const adminId = adminProfile?.id || '';
  const adminName = adminProfile?.full_name || 'Surya CS';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
      <div className="p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-[1px]">
          <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
            <img src="/images/surya-portrait.jpg" alt="Surya" className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">{adminName}</h2>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* The Chat Area */}
      <div className="flex-1 overflow-hidden">
        {adminId ? (
          <ChatWindow currentUserId={user?.id || ''} otherUserId={adminId} />
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <p className="text-[var(--color-text-primary)] font-medium mb-1">Admin not available</p>
              <p className="text-[var(--color-text-muted)] text-sm">Unable to connect to the admin. Please try again later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
