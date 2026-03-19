import { createClient } from '@/utils/supabase/server';
import UserRow from './user-row';

export default async function UserManagement() {
  const supabase = await createClient();
  
  // Fetch users from profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>User Management</h1>
      
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1rem' }}>User</th>
              <th style={{ padding: '1.25rem 1rem' }}>Status</th>
              <th style={{ padding: '1.25rem 1rem' }}>Usage (Token/Limit)</th>
              <th style={{ padding: '1.25rem 1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
