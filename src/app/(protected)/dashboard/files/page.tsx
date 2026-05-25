import { FileText, Download, UploadCloud } from 'lucide-react';

export default function ClientFilesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Project Files</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Access deliverables, assets, and invoices.</p>
        </div>
        <button className="btn btn--glass text-sm py-2 flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Upload File
        </button>
      </div>

      <div className="glass-card-strong p-12 rounded-2xl border border-[var(--color-glass-border)] text-center mt-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">Supabase Storage Integration</h3>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          This section will be connected to Supabase Storage to allow secure file sharing between you and the admin.
        </p>
      </div>
    </div>
  );
}
