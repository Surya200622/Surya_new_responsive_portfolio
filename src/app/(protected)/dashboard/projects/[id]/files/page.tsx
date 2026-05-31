'use client';

import { useState, useEffect } from 'react';
import { Upload, File, Image as ImageIcon, X, Loader2, Folder } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('general');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchFiles();
  }, [params.id]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setFiles(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${params.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: params.id,
          uploaded_by: userData.user.id,
          file_name: file.name,
          file_url: publicUrlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          category: uploadCategory
        });

      if (dbError) throw dbError;

      // Refresh list
      fetchFiles();
      
      // Reset input
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error.message || 'Please check if the "project-files" storage bucket exists and has the correct permissions.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      // Extract path from url
      const path = url.split('/').slice(-2).join('/');
      
      await supabase.storage.from('project-files').remove([path]);
      await supabase.from('project_files').delete().eq('id', id);
      
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Project Files</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Upload requirements, logos, documents, or payment screenshots.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-glass-border)] text-sm rounded-xl px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]"
          >
            <option value="general">General</option>
            <option value="requirements">Requirements</option>
            <option value="document">Document</option>
            <option value="image">Image/Logo</option>
            <option value="payment_screenshot">Payment Screenshot</option>
          </select>
          
          <label className="btn py-2 px-4 cursor-pointer relative overflow-hidden group">
            <span className="flex items-center gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Upload File'}
            </span>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {files.length > 0 ? (
          files.map(file => (
            <div key={file.id} className="glass-card-strong p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center justify-between group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0">
                  {file.file_type?.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-[var(--color-accent-secondary)]" />
                  ) : (
                    <File className="w-5 h-5 text-[var(--color-accent-primary)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] truncate block">
                    {file.file_name}
                  </a>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    <span className="uppercase px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] rounded-sm">
                      {file.category.replace('_', ' ')}
                    </span>
                    <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteFile(file.id, file.file_url)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">No files uploaded</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Upload any requirements, documents, or screenshots related to your project here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
