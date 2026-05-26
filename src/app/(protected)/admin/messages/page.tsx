import { MessageSquare } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';
import { createClient } from '@/lib/supabase/server';

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
      {/* Sidebar for Conversations */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[var(--color-glass-border)]">
          <h2 className="font-display font-bold text-[var(--color-text-primary)]">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {/* This will be populated with actual client conversations in Phase 6 */}
          <div className="p-4 text-center text-sm text-[var(--color-text-muted)] mt-10">
            Select a client to start chatting
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-[var(--color-bg-primary)]/50 overflow-hidden">
        <ChatWindow currentUserId={user?.id || ''} otherUserId="selected-client-id-placeholder" />
      </div>
    </div>
  );
}
