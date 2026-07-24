import ChatWindow from '@/components/chat/ChatWindow';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Messages | Surya CS',
};

export default async function ClientMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch the admin user ID so messages go to the right person
  const adminProfileData = await db.select({
    id: users.id,
    name: users.name,
    image: users.image
  }).from(users).where(eq(users.role, 'admin')).limit(1);

  const adminProfile = adminProfileData[0];
  const adminId = adminProfile?.id || '';
  const adminName = adminProfile?.name || 'Surya CS';
  const adminAvatar = adminProfile?.image || '/images/surya-portrait.jpg';

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-8rem)] flex flex-col glass-card-strong rounded-2xl border border-[var(--color-glass-border)] overflow-hidden min-h-0">
      <div className="p-3 md:p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-glass)] flex items-center gap-3 md:gap-4 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] p-[1px]">
          <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center overflow-hidden">
            <img src={adminAvatar} alt="Surya" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">{adminName}</h2>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* The Chat Area */}
      <div className="flex-1 overflow-hidden">
        {adminId ? (
          // @ts-ignore
          <ChatWindow currentUserId={session.user.id} otherUserId={adminId} />
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <p className="text-[var(--color-text-primary)] font-medium mb-1">Admin not available</p>
              <p className="text-[var(--color-text-muted)] text-sm">Unable to connect to the admin. Please try again later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
