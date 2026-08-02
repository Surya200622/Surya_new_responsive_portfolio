import { ArrowLeft, Mail, Phone, Building2, Calendar, Briefcase, MessageSquare, File, Download, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClientProjectsTable from './ClientProjectsTable';
import ClientQuotationsTable from './ClientQuotationsTable';
import DeleteFileButton from '@/components/admin/DeleteFileButton';
import { db } from '@/db';
import { users, projects, messages, quotations, projectFiles } from '@/db/schema';
import { eq, or, and, desc, inArray, isNotNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Clients | Surya CS',
};

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  // Fetch client profile
  const clientData = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
    
  const client = clientData[0];

  if (!client || client.role !== 'client') {
    notFound();
  }

  // Fetch client's projects
  const clientProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, id))
    .orderBy(desc(projects.createdAt));

  // Fetch message count
  const allMessages = await db
    .select({ id: messages.id })
    .from(messages)
    .where(or(eq(messages.senderId, id), eq(messages.receiverId, id)));
  const messageCount = allMessages.length;

  // Fetch client quotations
  const clientQuotations = await db
    .select({
      quotation: quotations,
      project: projects
    })
    .from(quotations)
    .innerJoin(projects, eq(quotations.projectId, projects.id))
    .where(eq(quotations.clientId, id))
    .orderBy(desc(quotations.createdAt));

  // Fetch client's uploaded files (from Projects)
  const projectIds = clientProjects.map(p => p.id);
  
  let unifiedFiles: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
    category: string;
    createdAt: Date | null;
    projectName: string;
  }> = [];
  
  if (projectIds.length > 0) {
    const projectFilesData = await db
      .select({
        file: projectFiles,
        project: projects
      })
      .from(projectFiles)
      .innerJoin(projects, eq(projectFiles.projectId, projects.id))
      .where(inArray(projectFiles.projectId, projectIds))
      .orderBy(desc(projectFiles.createdAt));
      
    const mappedProjectFiles = projectFilesData.map(d => ({
      id: d.file.id,
      fileName: d.file.fileName,
      fileUrl: d.file.fileUrl,
      fileSize: d.file.fileSize,
      fileType: d.file.fileType,
      category: d.file.category || 'project_file',
      createdAt: d.file.createdAt,
      projectName: d.project.title,
    }));
    
    unifiedFiles = [...unifiedFiles, ...mappedProjectFiles];
  }

  // Fetch client's uploaded files (from Messages)
  const messageFilesData = await db
    .select({
      message: messages,
      project: projects
    })
    .from(messages)
    .leftJoin(projects, eq(messages.projectId, projects.id))
    .where(and(eq(messages.senderId, id), isNotNull(messages.fileUrl)))
    .orderBy(desc(messages.createdAt));

  const mappedMessageFiles = messageFilesData.map(d => {
    const m = d.message;
    // Infer file type from extension
    const ext = m.fileName?.split('.').pop()?.toLowerCase() || '';
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);
    
    return {
      id: m.id,
      fileName: m.fileName || 'Chat Attachment',
      fileUrl: m.fileUrl!,
      fileSize: undefined, // Unknown from chat
      fileType: isImage ? `image/${ext}` : 'application/octet-stream',
      category: 'chat_attachment',
      createdAt: m.createdAt,
      projectName: d.project?.title || 'Sent in Chat',
    };
  });

  unifiedFiles = [...unifiedFiles, ...mappedMessageFiles].sort((a, b) => {
    const timeA = a.createdAt?.getTime() || 0;
    const timeB = b.createdAt?.getTime() || 0;
    return timeB - timeA; // Descending
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Clients
      </Link>

      {/* Client Header Card */}
      <div className="glass-card-strong p-8 rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5 shrink-0">
            <div className="w-full h-full rounded-2xl bg-[var(--color-bg-primary)] flex items-center justify-center font-display font-bold text-3xl text-[var(--color-text-primary)]">
              {client.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
              {client.name || 'Unnamed Client'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {client.companyName || 'Individual Client'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                <a href={`mailto:${client.email}`} className="hover:text-[var(--color-accent-primary)] transition-colors truncate">
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Phone className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:text-[var(--color-accent-primary)] transition-colors">
                    {client.phone}
                  </a>
                </div>
              )}
              {client.companyName && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Building2 className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <span>{client.companyName}</span>
                </div>
              )}
              {client.emailVerified && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <span>Joined {new Date(client.emailVerified).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 shrink-0">
            <Link
              href={`/admin/messages?client=${id}`}
              className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Projects</span>
          </div>
          <p className="text-2xl font-display font-bold text-[var(--color-text-primary)] ml-11">
            {clientProjects.length}
          </p>
        </div>
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Messages</span>
          </div>
          <p className="text-2xl font-display font-bold text-[var(--color-text-primary)] ml-11">
            {messageCount}
          </p>
        </div>
        <div className="glass-card-strong p-5 rounded-2xl border border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">Verified</span>
          </div>
          <p className="text-lg font-display font-bold text-[var(--color-text-primary)] ml-11">
            {client.emailVerified ? new Date(client.emailVerified).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'No'}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-6">Projects</h2>
        <ClientProjectsTable initialProjects={clientProjects} />
      </div>

      {/* Quotations & Payments Table */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-6">Quotations & Payments</h2>
        <ClientQuotationsTable initialQuotations={clientQuotations.map(q => ({ ...q.quotation, projects: { project_name: q.project.title } }))} />
      </div>

      {/* Uploaded Files Section */}
      <div className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)]">
        <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-6">Client Uploaded Files</h2>

        {unifiedFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unifiedFiles.map((file) => (
              <div key={file.id} className="glass-card-strong p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center justify-between group bg-[var(--color-bg-glass)]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center shrink-0">
                    {file.fileType?.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-[var(--color-accent-secondary)]" />
                    ) : (
                      <File className="w-5 h-5 text-[var(--color-accent-primary)]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] truncate block">
                      {file.fileName}
                    </a>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                        <span className="uppercase px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] rounded-sm">
                          {file.category?.replace('_', ' ')}
                        </span>
                        {file.fileSize !== undefined && (
                          <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-secondary)] truncate">
                        {file.category === 'chat_attachment' ? file.projectName : `Project: ${file.projectName}`}
                      </span>
                    </div>
                  </div>
                </div>
                <a 
                  href={`${file.fileUrl}?download=`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-all shrink-0"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
                <DeleteFileButton id={file.id} type={file.category === 'chat_attachment' ? 'chat_attachment' : 'project_file'} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)] font-medium">No files uploaded yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Files uploaded by the client will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
