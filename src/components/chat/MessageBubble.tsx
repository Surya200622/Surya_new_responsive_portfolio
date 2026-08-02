import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, FileText, FileArchive, File as FileIcon, Image as ImageIcon, Copy, Trash2 } from 'lucide-react';
import type { Message } from '@/hooks/useRealtimeMessages';
import { useState, useEffect, useRef } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isAdmin?: boolean;
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

export default function MessageBubble({ message, isOwn, isAdmin }: MessageBubbleProps) {
  const hasAttachment = Boolean(message.fileUrl);
  const isImg = hasAttachment && message.fileName ? isImageFile(message.fileName) : false;

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    
    // Close context menu on any click outside
    document.addEventListener('click', handleClickOutside);
    // Also close on scroll to prevent floating menu staying behind
    document.addEventListener('scroll', () => setContextMenu(null), true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', () => setContextMenu(null), true);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
    }
    setContextMenu(null);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this message?')) {
      setContextMenu(null);
      return;
    }
    
    setIsDeleting(true);
    setContextMenu(null);
    try {
      const res = await fetch(`/api/chat/messages?id=${message.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      // A full state reload isn't needed here if the Realtime hook receives a delete event, 
      // but if not, we can rely on polling or page refresh. The user wanted simple delete functionality.
      // Easiest is to force a reload, or wait for next poll.
      // We will let the polling mechanism catch the deleted message (it will vanish).
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleting) return null; // Optimistic hide

  const canDelete = isOwn || isAdmin;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
        onContextMenu={handleContextMenu}
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

      {/* Custom Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            ref={menuRef}
            className="fixed z-[9999] bg-[var(--color-bg-primary)] border border-[var(--color-glass-border)] shadow-xl rounded-xl py-1 w-40 overflow-hidden backdrop-blur-md"
            style={{ 
              top: Math.min(contextMenu.y, window.innerHeight - 100), // Prevent going off bottom screen 
              left: Math.min(contextMenu.x, window.innerWidth - 160) // Prevent going off right screen
            }}
          >
            {hasAttachment && canDelete && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete File
              </button>
            )}
            {message.content && (
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
              >
                <Copy className="w-4 h-4" />
                Copy Text
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
