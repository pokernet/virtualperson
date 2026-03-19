import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Strict Admin Check
  if (!user || user.email !== 'xroot0@gmail.com') {
    return redirect('/login?error=' + encodeURIComponent('Access Denied: Admin privileges required.'));
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <AdminSidebar />

      {/* Admin Content Area */}
      <main style={{
        flex: 1,
        padding: '3rem',
        overflowY: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
}
