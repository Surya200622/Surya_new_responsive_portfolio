import { motion } from 'framer-motion';
import { Check, CheckCheck, FileText, FileArchive, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import type { Message } from '@/hooks/useRealtimeMessages';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return <FileText className="w-5 h-5" />;
    case 'zip':
    case 'rar':
    case '7z': return <FileArchive className="w-5 h-5" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg': return <ImageIcon className="w-5 h-5" />;
    default: return <FileIcon className="w-5 h-5" />;
  }
};

const isImageFile = (fileName: string) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(fileName);
};

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const hasAttachment = Boolean(message.fileUrl);
  const isImg = hasAttachment && message.fileName ? isImageFile(message.fileName) : false;

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
        {hasAttachment && (
          <div className="mb-2">
            {isImg ? (
              <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-black/10 hover:opacity-90 transition-opacity">
                <img src={message.fileUrl} alt={message.fileName || 'Attachment'} className="max-w-full h-auto max-h-[250px] object-cover" />
              </a>
            ) : (
              <a 
                href={message.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium shadow-sm ${
                  isOwn ? 'bg-black/10 hover:bg-black/20 text-[#0a0a0f]' : 'bg-[var(--color-bg-primary)] hover:brightness-95 text-[var(--color-text-primary)] border border-[var(--color-glass-border)]'
                } transition-all`}
              >
                {getFileIcon(message.fileName || '')}
                <span className="truncate max-w-[200px]">{message.fileName || 'Attachment'}</span>
              </a>
            )}
          </div>
        )}

        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

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
