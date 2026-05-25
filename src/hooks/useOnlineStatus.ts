'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useOnlineStatus(userId: string | undefined) {
  const [isOnline, setIsOnline] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`online-status:${userId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setIsOnline(Object.keys(newState).length > 0);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return isOnline;
}
