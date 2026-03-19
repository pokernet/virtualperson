import { createClient } from '@/utils/supabase/server';
import OnlineUsers from './OnlineUsers';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Fetch some stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: personaCount } = await supabase
    .from('ai_personas')
    .select('*', { count: 'exact', head: true });

  const { count: messageCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>System Overview</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <StatCard title="Total Users" value={userCount || 0} icon="👥" />
        <StatCard title="AI Personas" value={personaCount || 0} icon="🤖" />
        <StatCard title="Total Messages" value={messageCount || 0} icon="💬" />
      </div>

      <OnlineUsers />

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Welcome, Administrator</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          This is your central command center for Eternity AI. From here you can manage users, 
          monitor system health, and adjust AI model token limits for all tenants.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number | string, icon: string }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>
        {value}
      </div>
    </div>
  );
}
