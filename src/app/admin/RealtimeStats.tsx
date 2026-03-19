'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function RealtimeStats() {
  const [stats, setStats] = useState({
    userCount: 0,
    personaCount: 0,
    messageCount: 0,
    visitorCount: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialStats = async () => {
      const [{ count: uCount }, { count: pCount }, { count: mCount }, { data: siteStats }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ai_personas').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('site_stats').select('total_visitors').eq('id', 1).single()
      ]);

      setStats({
        userCount: uCount || 0,
        personaCount: pCount || 0,
        messageCount: mCount || 0,
        visitorCount: siteStats?.total_visitors || 0
      });
      setLoading(false);
    };

    fetchInitialStats();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        refreshCount('profiles', 'userCount');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_personas' }, () => {
        refreshCount('ai_personas', 'personaCount');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        refreshCount('messages', 'messageCount');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_stats' }, (payload) => {
        if (payload.new && 'total_visitors' in payload.new) {
           setStats(prev => ({ ...prev, visitorCount: (payload.new as any).total_visitors as number }));
        }
      })
      .subscribe();

    async function refreshCount(table: string, key: string) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, [key]: count || 0 }));
    }

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    }}>
      <StatCard title="Total Visitors" value={stats.visitorCount} icon="👀" loading={loading} />
      <StatCard title="Total Users" value={stats.userCount} icon="👥" loading={loading} />
      <StatCard title="AI Personas" value={stats.personaCount} icon="🤖" loading={loading} />
      <StatCard title="Total Messages" value={stats.messageCount} icon="💬" loading={loading} />
    </div>
  );
}

function StatCard({ title, value, icon, loading }: { title: string, value: number, icon: string, loading: boolean }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>
        {loading ? '...' : value.toLocaleString()}
      </div>
    </div>
  );
}
