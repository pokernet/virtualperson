'use client';

import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import UsageStatus from '@/components/UsageStatus';

interface Persona {
  id: string;
  name: string;
  relationship: string;
  created_at: string;
  avatar_url: string | null;
  is_public: boolean;
}

interface Profile {
  openai_tokens: number;
  anthropic_tokens: number;
  local_tokens: number;
  account_status: string;
}

export default function DashboardClient({ 
  personas, 
  userEmail,
  profile
}: { 
  personas: Persona[] | null, 
  userEmail: string | undefined,
  profile: Profile | null
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
      <header className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>{t('dashboard.title')}</h1>
          <div className="header-divider" style={{ height: '1.5rem', width: '1px', background: 'var(--border-color)' }} />
          <Link href="/public" style={{ 
            fontSize: '0.9rem', 
            color: 'var(--accent-primary)', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '500'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {isRTL ? 'לוח ציבורי' : 'Public Dashboard'}
          </Link>
        </div>
        <div className="header-meta" style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
          {profile && (
            <div className="usage-container">
              <UsageStatus 
                openaiTokens={profile.openai_tokens}
                anthropicTokens={profile.anthropic_tokens}
                localTokens={profile.local_tokens}
                status={profile.account_status}
              />
            </div>
          )}
          <LanguageSwitcher />
          <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
          }}>
            <span className="user-email" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
                <Link href={`/chat/${persona.id}`} className="persona-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="persona-avatar-wrapper" style={{ 
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    flexShrink: 0
                  }}>
                    {persona.avatar_url ? (
                      <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      persona.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="persona-info">
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '0.35rem', color: 'white' }}>
                      {persona.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {persona.relationship}
                    </p>
                  </div>
                </Link>

                <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '1.25rem', 
                    borderTop: '1px solid var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                  <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexDirection: isRTL ? 'row-reverse' : 'row'
                  }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        {/* Public Toggle Icon only */}
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const { togglePersonaPublic } = await import('../memorial/actions');
                            await togglePersonaPublic(persona.id, !persona.is_public);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: persona.is_public ? '#4caf50' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                          title={persona.is_public ? (isRTL ? 'הפוך לפרטי' : 'Make Private') : (isRTL ? 'הפוך לציבורי' : 'Make Public')}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {persona.is_public ? (
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />
                            ) : (
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                            )}
                          </svg>
                        </button>
                        
                        <Link href={`/memorial/${persona.id}`} style={{ 
                          color: 'var(--text-secondary)', 
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }} title={isRTL ? 'דף זיכרון' : 'Memorial'}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </Link>

                        <Link href={`/wizard?id=${persona.id}`} style={{ 
                          color: 'var(--text-secondary)', 
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }} title={t('common.edit')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                      </div>

                      <Link href={`/chat/${persona.id}`} className="btn-primary" style={{ 
                        padding: '0.5rem 1.25rem', 
                        fontSize: '0.85rem', 
                        fontWeight: '600',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), #6366f1)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                      }}>
                        {t('dashboard.chat')}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={isRTL ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7"} />
                        </svg>
                      </Link>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                  }}>
                    <span>{new Date(persona.created_at).toLocaleDateString(language)}</span>
                    <span style={{ 
                      color: persona.is_public ? '#4caf50' : 'var(--text-muted)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: persona.is_public ? '#4caf50' : 'var(--text-muted)' }} />
                      {persona.is_public ? (isRTL ? 'ציבורי' : 'Public') : (isRTL ? 'פרטי' : 'Private')}
                    </span>
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
      <style jsx global>{`
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .header-meta {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .header-divider {
            display: none !important;
          }
          .user-email {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          .persona-card-content {
            flex-direction: row !important;
            align-items: center !important;
            gap: 1.25rem !important;
            margin-bottom: 1rem !important;
          }
          .persona-avatar-wrapper {
            margin-bottom: 0 !important;
          }
          .persona-info {
            text-align: ${isRTL ? 'right' : 'left'} !important;
          }
          .header-meta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .usage-container {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
