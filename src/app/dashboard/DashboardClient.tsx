'use client';

import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Persona {
  id: string;
  name: string;
  relationship: string;
  created_at: string;
  avatar_url: string | null;
}

export default function DashboardClient({ 
  personas, 
  userEmail 
}: { 
  personas: Persona[] | null, 
  userEmail: string | undefined 
}) {
  const { language, t, isRTL } = useLanguage();

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
        borderBottom: '1px solid var(--border-color)',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{t('dashboard.title')}</h1>
        <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <LanguageSwitcher />
          <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              flexDirection: isRTL ? 'row-reverse' : 'row'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {userEmail}
            </span>
            <form action={logout}>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                {t('common.signOut')}
                </button>
            </form>
          </div>
        </div>
      </header>

      <main>
        {personas && personas.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
            direction: isRTL ? 'rtl' : 'ltr'
          }}>
            {/* Create New Card */}
            <Link href="/wizard" className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '16px',
              minHeight: '220px',
              borderStyle: 'dashed',
              borderWidth: '2px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2.5rem',
                color: 'var(--accent-primary)',
                marginBottom: '0.5rem'
              }}>+</div>
              <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t('dashboard.createNew')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {t('dashboard.createNewDesc')}
              </p>
            </Link>

            {/* List existing personas */}
            {personas.map((persona) => (
              <div key={persona.id} className="glass-panel fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                borderRadius: '16px',
                minHeight: '220px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                textAlign: isRTL ? 'right' : 'left'
              }}>
                <Link href={`/chat/${persona.id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: 'var(--bg-tertiary)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {persona.avatar_url ? (
                      <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      persona.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    {persona.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {persona.relationship}
                  </p>
                </Link>

                <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '1rem', 
                    borderTop: '1px solid var(--border-color)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(persona.created_at).toLocaleDateString(language)}
                    </span>
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        alignItems: 'center',
                        flexDirection: isRTL ? 'row-reverse' : 'row' 
                    }}>
                      <Link href={`/wizard?id=${persona.id}`} style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }} title={t('dashboard.editProfile')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        {t('common.edit')}
                      </Link>
                      <Link href={`/chat/${persona.id}`} style={{ 
                          color: 'var(--accent-primary)', 
                          fontSize: '0.9rem', 
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                      }}>
                        {t('dashboard.chat')} {isRTL ? '←' : '→'}
                      </Link>
                    </div>
                </div>

                {/* Delete button absolutely positioned */}
                <form action={async () => {
                  const { deletePersona } = await import('./actions');
                  if (confirm(t('dashboard.deletePersona') + '?')) {
                    await deletePersona(persona.id);
                  }
                }} style={{ position: 'absolute', top: '1rem', [isRTL ? 'left' : 'right']: '1rem' }}>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.2s'
                  }} 
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title={t('dashboard.deletePersona')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            padding: '5rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '4rem auto'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>{t('dashboard.noProfiles')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
              {t('dashboard.noProfilesDesc')}
            </p>
            <Link href="/wizard" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              {t('dashboard.buildFirst')}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
