'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare, Search, ArrowLeft, Loader2 } from 'lucide-react';

interface ClientProfile {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  avatar_url?: string;
  lastMessage?: {
    content: string;
    created_at: string;
    unread_count: number;
  } | null;
}

export default function AdminMessagesPage() {
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('client');

  const [currentUserId, setCurrentUserId] = useState('');
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(preselectedClientId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/chat/clients');
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.currentUserId);
          setClients(data.clients);

          if (preselectedClientId && data.clients.find((c: ClientProfile) => c.id === preselectedClientId)) {
            setSelectedClient(preselectedClientId);
          }
        }
      } catch (e) {
        console.warn('Admin messages load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Poll for new clients/unread counts every 10 seconds
    const intervalId = setInterval(loadData, 10000);
    return () => clearInterval(intervalId);
  }, [preselectedClientId]);

  const filteredClients = clients.filter(client =>
    client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort clients: those with recent messages first, then alphabetical
  const sortedClients = [...filteredClients].sort((a, b) => {
    const aMsg = a.lastMessage;
    const bMsg = b.lastMessage;
    if (aMsg?.created_at && bMsg?.created_at) {
      return new Date(bMsg.created_at).getTime() - new Date(aMsg.created_at).getTime();
    }
    if (aMsg?.created_at) return -1;
    if (bMsg?.created_at) return 1;
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  const selectedClientProfile = clients.find(c => c.id === selectedClient);

  if (loading) {
    return (
      <div className="h-[calc(100dvh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-8rem)] flex flex-col md:flex-row glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
      {/* Sidebar — Client List */}
      <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex-col h-full shrink-0 ${selectedClient ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[var(--color-glass-border)] space-y-3">
          <h2 className="font-display font-bold text-[var(--color-text-primary)]">Conversations</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </div>
            <input
              type="text"
              className="auth-input pl-9 py-2 text-xs bg-[var(--color-bg-glass)]"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
          {sortedClients.length > 0 ? (
            sortedClients.map(client => {
              const lastMsg = client.lastMessage;
              const isSelected = selectedClient === client.id;
              const hasUnread = (lastMsg?.unread_count || 0) > 0;

              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20'
                      : 'hover:bg-[var(--color-bg-glass)] border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-sm font-display font-bold text-[var(--color-text-primary)]">
                      {client.full_name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {client.full_name || 'Unnamed'}
                      </p>
                      {lastMsg?.created_at && (
                        <span className="text-[10px] text-[var(--color-text-muted)] shrink-0 ml-2">
                          {new Date(lastMsg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[160px]">
                        {lastMsg?.content || client.email}
                      </p>
                      {hasUnread && (
                        <span className="w-5 h-5 bg-[var(--color-accent-primary)] rounded-full text-[10px] font-bold flex items-center justify-center text-[var(--color-bg-primary)] shrink-0 ml-2">
                          {lastMsg!.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-[var(--color-text-muted)] mt-10">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 bg-[var(--color-bg-primary)]/50 overflow-hidden flex-col ${!selectedClient ? 'hidden md:flex' : 'flex'}`}>
        {selectedClient && currentUserId ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center gap-3 shrink-0">
              {/* Mobile back button */}
              <button
                onClick={() => setSelectedClient('')}
                className="md:hidden p-1.5 -ml-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[var(--color-accent-primary)] p-0.5">
                <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-sm font-display font-bold text-[var(--color-text-primary)]">
                  {selectedClientProfile?.full_name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-[var(--color-text-primary)]">
                  {selectedClientProfile?.full_name || 'Client'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {selectedClientProfile?.email}
                </p>
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                key={selectedClient}
                currentUserId={currentUserId}
                otherUserId={selectedClient}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[var(--color-text-primary)] font-display font-semibold mb-1">
                Select a conversation
              </p>
              <p className="text-sm text-[var(--color-text-muted)] max-w-xs mx-auto">
                Choose a client from the sidebar to view and reply to their messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
