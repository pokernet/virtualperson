'use client';

import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside style={{
      width: '280px',
      background: 'rgba(10, 10, 12, 0.4)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
        Admin Panel
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/admin" className="admin-nav-link">Dashboard</Link>
        <Link href="/admin/users" className="admin-nav-link">User Management</Link>
        <Link href="/admin/settings" className="admin-nav-link">System Settings</Link>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <Link href="/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Back to App
        </Link>
      </div>

      <style jsx>{`
        .admin-nav-link {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .admin-nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
      `}</style>
    </aside>
  );
}
