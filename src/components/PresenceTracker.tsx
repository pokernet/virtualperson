'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function PresenceTracker() {
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase.channel('online-users', {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channel
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0],
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
