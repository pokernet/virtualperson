import { createPersona } from './actions'
import Link from 'next/link'

export default function WizardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      gap: '2rem'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <Link href="/dashboard" style={{
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create Profile</h1>
      </header>

      <main className="glass-panel" style={{
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Bring a memory to life.
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tell us about them so the AI can accurately represent their voice and personality.
          </p>
        </div>

        <form action={createPersona} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Their Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g., John Doe"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="relationship" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Your Relationship to Them
              </label>
              <input
                id="relationship"
                name="relationship"
                type="text"
                required
                placeholder="e.g., Son, Sister, Friend"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="traits" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Personality Traits
            </label>
            <textarea
              id="traits"
              name="traits"
              required
              rows={3}
              placeholder="e.g., Warm, sarcastic, always had a story to tell, loved gardening."
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="catchphrases" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Catchphrases & Speaking Style
            </label>
            <textarea
              id="catchphrases"
              name="catchphrases"
              rows={2}
              placeholder="e.g., Used the word 'grand' a lot. Often said, 'It'll all wash out in the rain.'"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="memories" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Key Memories & Life Details
            </label>
            <textarea
              id="memories"
              name="memories"
              required
              rows={4}
              placeholder="e.g., Grew up in Chicago. We used to go fishing every Sunday. Worked as a teacher for 40 years."
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
            Generate Persona & Start Chat
          </button>
        </form>
      </main>
    </div>
  )
}
