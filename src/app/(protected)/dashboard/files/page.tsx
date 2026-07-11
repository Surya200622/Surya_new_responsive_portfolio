'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { FileText, UploadCloud, Download, Trash2, Loader2, File, Image, FileArchive, X } from 'lucide-react';




interface UploadedFile {
  name: string;
  id: string;
  size: number;
  created_at: string;
  content_type?: string;
}

export default function ClientFilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const folderPath = `${user.id}/`;

      const { data: fileList, error: listError } = await supabase
        .storage
        .from('client-files')
        .list(folderPath, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) {
        console.warn('Storage list error:', listError.message);
        // Bucket might not exist yet — show empty state
        setFiles([]);
        if (listError.message.includes('not found') || listError.message.includes('does not exist')) {
          setError('storage_not_configured');
        }
      } else {
        // Filter out the .emptyFolderPlaceholder
        const realFiles = (fileList || []).filter(f => f.name !== '.emptyFolderPlaceholder');
        setFiles(realFiles.map(f => ({
          name: f.name,
          id: f.id || f.name,
          size: (f.metadata as any)?.size || 0,
          created_at: f.created_at || new Date().toISOString(),
          content_type: (f.metadata as any)?.mimetype,
        })));
      }
    } catch (e) {
      console.warn('Files load error:', e);
      setError('storage_not_configured');
    }
    setLoading(false);
  }

  async function handleUpload(selectedFiles: FileList | null) {
    if (!selectedFiles || selectedFiles.length === 0 || !userId) return;
    
    setUploading(true);
    setError(null);

    try {
      for (const file of Array.from(selectedFiles)) {
        const filePath = `${userId}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('client-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
            setError('storage_not_configured');
          } else {
            setError(uploadError.message);
          }
        }
      }

      // Reload files
      await loadFiles();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleDelete(fileName: string) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    const filePath = `${userId}/${fileName}`;
    const { error: deleteError } = await supabase
      .storage
      .from('client-files')
      .remove([filePath]);

    if (!deleteError) {
      setFiles(prev => prev.filter(f => f.name !== fileName));
    }
  }

  async function handleDownload(fileName: string) {
    const filePath = `${userId}/${fileName}`;
    const { data } = await supabase
      .storage
      .from('client-files')
      .createSignedUrl(filePath, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  }

  function formatFileSize(bytes: number): string {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-purple-400" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <FileArchive className="w-5 h-5 text-orange-400" />;
    }
    return <File className="w-5 h-5 text-blue-400" />;
  }

  // Extract display name (remove timestamp prefix)
  function getDisplayName(name: string): string {
    const match = name.match(/^\d+_(.+)$/);
    return match ? match[1] : name;
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Project Files</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Access deliverables, assets, and invoices.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || error === 'storage_not_configured'}
          className="btn btn--glass text-sm py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Error banner */}
      {error && error !== 'storage_not_configured' && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          <span>Upload failed: {error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error === 'storage_not_configured' ? (
        <div className="glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center mt-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">Storage Setup Required</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            The file storage bucket needs to be configured in Supabase. Please create a storage bucket named <code className="text-[var(--color-accent-primary)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded text-xs">client-files</code> in your Supabase dashboard.
          </p>
        </div>
      ) : files.length === 0 ? (
        <div
          className={`glass-card-strong p-12 rounded-2xl border-2 border-dashed text-center mt-6 transition-colors ${
            dragOver
              ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5'
              : 'border-[var(--color-glass-border)]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No files yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            Drag and drop files here, or click the Upload File button to get started.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Choose Files
          </button>
        </div>
      ) : (
        <div
          className={`glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-x-auto ${
            dragOver ? 'ring-2 ring-[var(--color-accent-primary)]' : ''
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-bg-glass)]">
              <tr>
                <th className="px-6 py-3">File</th>
                <th className="px-6 py-3 hidden sm:table-cell">Size</th>
                <th className="px-6 py-3 hidden sm:table-cell">Uploaded</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name} className="border-b border-[var(--color-glass-border)] last:border-0 hover:bg-[var(--color-bg-glass)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <span className="font-medium text-[var(--color-text-primary)] truncate max-w-[200px] sm:max-w-[300px]">
                        {getDisplayName(file.name)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] hidden sm:table-cell">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] hidden sm:table-cell">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(file.name)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-glass)] rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
