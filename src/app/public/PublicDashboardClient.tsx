'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Persona {
  id: string;
  name: string;
  relationship: string;
  avatar_url: string | null;
  description: string;
}

export default function PublicDashboardClient({ personas }: { personas: Persona[] }) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPersonas = personas.filter(persona => 
    (persona.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (persona.relationship || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (persona.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '2rem',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem', 
              background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.5))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              {t('public.title')}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t('public.subtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Search Bar */}
        <div style={{ marginBottom: '3rem', position: 'relative', maxWidth: '600px', margin: '0 auto 4rem' }}>
          <div className="glass-panel" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0.25rem 1rem', 
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 0.5rem' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('public.searchPlaceholder')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '0.8rem 1rem',
                fontSize: '1rem',
                width: '100%',
                outline: 'none',
                textAlign: isRTL ? 'right' : 'left'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredPersonas.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {filteredPersonas.map((persona) => (
              <div key={persona.id} className="glass-panel public-card" style={{ 
                padding: '2rem', 
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              >
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div className="avatar-container" style={{ 
                    width: '64px', 
                    height: '64px', 
                    flexShrink: 0,
                    borderRadius: '20px', 
                    background: 'var(--bg-tertiary)',
                    fontSize: '1.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    {persona.avatar_url ? (
                      <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      persona.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="name-container" style={{ textAlign: isRTL ? 'right' : 'left', flex: 1, minWidth: 0 }}>
                    <div className="name-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{persona.name}</h3>
                      <span className="public-badge" style={{ fontSize: '0.6rem', background: 'rgba(76, 175, 80, 0.15)', color: '#81c784', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isRTL ? 'ציבורי' : 'Public'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{persona.relationship}</p>
                  </div>
                </div>

                <div style={{ height: '60px', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {persona.description}
                    </p>
                </div>

                <Link href={`/memorial/${persona.id}`} style={{ 
                  marginTop: 'auto',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, var(--accent-primary), #6366f1)',
                  color: 'white',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  {t('public.visit')}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-tertiary)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.5 }}>🔍</div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              {searchQuery ? (isRTL ? 'לא נמצאו דפי זיכרון התואמים לחיפוש' : 'No memorials found matching your search.') : t('public.noPublic')}
            </p>
          </div>
        )}

        <div style={{ 
          marginTop: '6rem', 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
              {t('public.createTitle')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              {t('public.createSubtitle')}
            </p>
            <Link href="/wizard" className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700' }}>
                {t('public.createBtn')}
            </Link>
            <div style={{ marginTop: '2rem' }}>
              <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  {isRTL ? `← ${t('public.backToDashboard')}` : `← ${t('public.backToDashboard')}`}
              </Link>
            </div>
        </div>
      </div>
      <style jsx global>{`
        .public-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-primary) !important;
        }

        @media (max-width: 600px) {
          .card-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .name-container {
            text-align: center !important;
            width: 100%;
          }
          .name-row {
            justify-content: center !important;
            flex-direction: column !important;
            gap: 0.25rem !important;
          }
          .public-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
