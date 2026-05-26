'use client';

import { useEffect, useRef } from 'react';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Loader2 } from 'lucide-react';

interface ChatWindowProps {
  currentUserId: string;
  otherUserId: string;
}

export default function ChatWindow({ currentUserId, otherUserId }: ChatWindowProps) {
  const { messages, isTyping, isLoading, sendMessage, setTyping } = useRealtimeMessages(currentUserId, otherUserId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2 relative z-10"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <p className="text-[var(--color-text-primary)] font-medium mb-1">No messages yet</p>
              <p className="text-[var(--color-text-muted)] text-sm">Send a message to start the conversation.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.sender_id === currentUserId} 
            />
          ))
        )}

        {isTyping && (
          <div className="flex w-full justify-start mb-4">
            <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} onTyping={setTyping} />
    </div>
  );
}
