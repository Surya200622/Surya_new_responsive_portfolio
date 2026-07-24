import { motion } from 'framer-motion';
import { Paperclip, Check, CheckCheck } from 'lucide-react';
import type { Message } from '@/hooks/useRealtimeMessages';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 relative ${
        isOwn 
          ? 'bg-[var(--color-accent-primary)] text-[#0a0a0f] rounded-tr-sm' 
          : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] text-[var(--color-text-primary)] rounded-tl-sm'
      }`}>
        
        {/* File Attachment */}
        {message.fileUrl && (
          <a 
            href={message.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-2 p-2 rounded-lg mb-2 text-sm font-medium ${
              isOwn ? 'bg-black/10 hover:bg-black/20' : 'bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-primary)]/80'
            } transition-colors`}
          >
            <Paperclip className="w-4 h-4" />
            <span className="truncate">{message.fileName || 'Attachment'}</span>
          </a>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-medium ${
          isOwn ? 'text-black/60' : 'text-[var(--color-text-muted)]'
        }`}>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && (
            message.isRead ? <CheckCheck className="w-3 h-3 text-blue-700" /> : <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
