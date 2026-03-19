import { createClient } from '@/utils/supabase/server';
import OnlineUsers from './OnlineUsers';
import RealtimeStats from './RealtimeStats';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>System Overview</h1>
      
      <RealtimeStats />

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
