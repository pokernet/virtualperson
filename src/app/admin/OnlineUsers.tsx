'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface OnlineUser {
  user_id: string;
  email: string;
  name: string;
  online_at: string;
}

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: OnlineUser[] = [];
        
        Object.keys(state).forEach((key) => {
          const presence = state[key] as any;
          if (presence && presence[0]) {
            users.push(presence[0]);
          }
        });

        setOnlineUsers(users);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '10px', height: '10px', background: '#34d399', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #34d399' }}></span>
        Online Users ({onlineUsers.length})
      </h2>
      
      {onlineUsers.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users currently online.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {onlineUsers.map((user) => (
            <div key={user.user_id} style={{ 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ fontWeight: '600' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Online since: {new Date(user.online_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
