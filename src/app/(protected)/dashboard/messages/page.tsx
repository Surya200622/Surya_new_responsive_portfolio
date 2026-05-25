import { createClient } from '@/lib/supabase/server';
import { MessageSquare } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';

export default async function ClientMessagesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real app, we'd fetch the admin's ID or have a generic "support" channel.
  // We'll pass the current user's ID as the client to the chat component.

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
      <div className="p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-[1px]">
          <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center">
            <img src="/images/surya-portrait.jpg" alt="Surya" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-white">Surya CS</h2>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* The Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow currentUserId={user?.id || ''} otherUserId="admin-id-placeholder" />
      </div>
    </div>
  );
}
