import { Search, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import ClientActionsMenu from './ClientActionsMenu';
import { db } from '@/db';
import { users, projects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Clients | Surya CS',
};

export default async function AdminClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/admin/login');
  }

  // Fetch clients and count their projects
  // We'll fetch clients, then fetch projects to group them
  const clientsData = await db
    .select()
    .from(users)
    .where(eq(users.role, 'client'))
    .orderBy(desc(users.emailVerified));
    
  const allProjects = await db
    .select({
      id: projects.id,
      clientId: projects.clientId
    })
    .from(projects);
    
  const clientsWithProjects = clientsData.map(client => {
    return {
      ...client,
      projectsCount: allProjects.filter(p => p.clientId === client.id).length
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">Clients</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage all your freelance clients.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>
          <input 
            type="text" 
            className="auth-input pl-9 py-2 text-sm bg-[var(--color-bg-glass)]" 
            placeholder="Search clients..." 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {clientsWithProjects?.map((client) => (
          <div key={client.id} className="glass-card-strong p-6 rounded-2xl border border-[var(--color-glass-border)] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-warm)] p-0.5">
                  <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center font-display font-bold text-lg text-[var(--color-text-primary)]">
                    {client.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)]">{client.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{client.companyName || 'Individual'}</p>
                </div>
              </div>
              <ClientActionsMenu clientId={client.id} />
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                <a href={`mailto:${client.email}`} className="hover:text-[var(--color-text-primary)] transition-colors truncate">{client.email}</a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Phone className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <a href={`tel:${client.phone}`} className="hover:text-[var(--color-text-primary)] transition-colors">{client.phone}</a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-glass-border)]">
              <div className="text-xs text-[var(--color-text-muted)]">
                <span className="font-semibold text-[var(--color-text-primary)]">{client.projectsCount}</span> Projects
              </div>
              <Link href={`/admin/clients/${client.id}`} className="text-xs font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-warm)] transition-colors">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
