import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's AI personas
  const { data: personas, error } = await supabase
    .from('ai_personas')
    .select('id, name, relationship, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      gap: '2rem'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your Connections</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user.email}
          </span>
          <form action={logout}>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main>
        {personas && personas.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Create New Card */}
            <Link href="/wizard" className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '16px',
              minHeight: '200px',
              borderStyle: 'dashed',
              borderWidth: '2px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                fontSize: '2rem',
                color: 'var(--accent-primary)',
                marginBottom: '1rem'
              }}>+</div>
              <h3 style={{ fontWeight: '500' }}>Create New Profile</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem' }}>
                Begin the process of immortalizing someone's memory.
              </p>
            </Link>

            {/* List existing personas */}
            {personas.map((persona) => (
              <div key={persona.id} className="glass-panel fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                borderRadius: '16px',
                minHeight: '200px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}>
                <Link href={`/chat/${persona.id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-tertiary)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {persona.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {persona.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {persona.relationship}
                  </p>
                </Link>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(persona.created_at).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/chat/${persona.id}`} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Chat →</Link>
                    </div>
                </div>

                {/* Delete button absolutely positioned */}
                <form action={async () => {
                  'use server';
                  const { deletePersona } = await import('./actions');
                  await deletePersona(persona.id);
                }} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }} title="Delete Persona">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </form>
              </div>
            ))}

          </div>
        ) : (
          <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No profiles yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Create your first AI persona to preserve the memories and voice of a loved one.
            </p>
            <Link href="/wizard" className="btn-primary">
              Build a Profile
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
