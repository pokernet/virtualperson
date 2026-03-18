'use client';

import { createPersona } from './actions'
import Link from 'next/link'
import { useState, useRef } from 'react'

interface PersonaData {
  id: string;
  name: string;
  relationship: string;
  traits: string;
  catchphrases: string;
  memories: string;
  avatar_url?: string;
}

export default function WizardClient({ 
  personaData, 
  user 
}: { 
  personaData: PersonaData | null, 
  user: any 
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(personaData?.avatar_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!personaData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </h1>
      </header>

      <main className="glass-panel" style={{
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        opacity: isSubmitting ? 0.7 : 1,
        pointerEvents: isSubmitting ? 'none' : 'auto',
        transition: 'opacity 0.2s'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            {isEditing ? `Updating ${personaData.name}` : 'Bring a memory to life.'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isEditing 
              ? 'Refine their traits and speaking style to better match your memories.'
              : 'Tell us about them so the AI can accurately represent their voice and personality.'}
          </p>
        </div>

        <form 
          action={createPersona} 
          onSubmit={() => setIsSubmitting(true)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Hidden ID input for updates */}
          {isEditing && <input type="hidden" name="id" value={personaData.id} />}
          {isEditing && <input type="hidden" name="existing_avatar_url" value={personaData.avatar_url || ''} />}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '2px dashed var(--border-color)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Add Photo</p>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <label htmlFor="avatar" style={{ 
                fontSize: '0.9rem', 
                color: 'var(--accent-primary)', 
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'underline'
              }}>
                {isEditing ? 'Change Profile Picture' : 'Upload Profile Picture'}
              </label>
              <input 
                id="avatar" 
                name="avatar" 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
            </div>
          </div>

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
                defaultValue={personaData?.name || ''}
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
                defaultValue={personaData?.relationship || ''}
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
              defaultValue={personaData?.traits || ''}
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
              defaultValue={personaData?.catchphrases || ''}
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
              defaultValue={personaData?.memories || ''}
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

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary" 
            style={{ 
                marginTop: '1rem', 
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Saving Profile...
              </>
            ) : (
              isEditing ? 'Save Changes & Return to Chat' : 'Generate Persona & Start Chat'
            )}
          </button>
        </form>
      </main>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
