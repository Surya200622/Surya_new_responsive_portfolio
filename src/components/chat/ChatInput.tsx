import { useState, useRef } from 'react';
import { Send, Paperclip, Loader2, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, fileData?: { url: string; name: string }) => Promise<void>;
  onTyping: () => void;
}

export default function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !file) || isSending) return;

    setIsSending(true);
    try {
      let fileData;
      
      if (file) {
        // In a real app, upload to Supabase Storage here and get the public URL
        // const filePath = `chat_attachments/${Date.now()}_${file.name}`;
        // const { error: uploadError } = await supabase.storage.from('attachments').upload(filePath, file);
        // const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);
        // fileData = { url: data.publicUrl, name: file.name };
        
        // Mocking upload for now since storage bucket isn't set up
        fileData = { url: '#', name: file.name };
      }

      await onSendMessage(content, fileData);
      setContent('');
      setFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else {
      onTyping();
    }
  };

  return (
    <div className="p-4 bg-[var(--color-bg-glass)] border-t border-[var(--color-glass-border)] shrink-0 relative z-20">
      
      {/* File Preview */}
      {file && (
        <div className="absolute bottom-full left-4 mb-2 p-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-lg flex items-center gap-3">
          <Paperclip className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <span className="text-sm text-[var(--color-text-primary)] max-w-[150px] truncate">{file.name}</span>
          <button 
            type="button" 
            onClick={() => setFile(null)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-colors shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="flex-1 bg-[var(--color-bg-tertiary)] border border-[var(--color-glass-border)] rounded-xl relative focus-within:border-[var(--color-accent-primary)] transition-colors">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] px-4 py-3 max-h-32 min-h-[44px] outline-none resize-none custom-scrollbar"
            rows={1}
            disabled={isSending}
          />
        </div>

        <button
          type="submit"
          disabled={isSending || (!content.trim() && !file)}
          className="gradient-btn p-3 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? <Loader2 className="w-5 h-5 animate-spin text-[#0a0a0f]" /> : <Send className="w-5 h-5 text-[#0a0a0f]" />}
        </button>
      </form>
    </div>
  );
}
