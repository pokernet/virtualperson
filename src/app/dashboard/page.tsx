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
              <Link href={`/chat/${persona.id}`} key={persona.id} className="glass-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                borderRadius: '16px',
                minHeight: '200px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
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
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Created {new Date(persona.created_at).toLocaleDateString()}
                    </span>
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Start Chatting →</span>
                </div>
              </Link>
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
