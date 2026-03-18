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
          marginBottom: '4rem',
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

        {personas && personas.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {personas.map((persona) => (
              <div key={persona.id} className="glass-panel public-card" style={{ 
                padding: '2rem', 
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '20px', 
                    background: 'var(--bg-tertiary)',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    {persona.avatar_url ? (
                      <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      persona.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{persona.name}</h3>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(76, 175, 80, 0.15)', color: '#81c784', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {isRTL ? 'ציבורי' : 'Public'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{persona.relationship}</p>
                  </div>
                </div>

                <div style={{ height: '60px', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {persona.description}
                    </p>
                </div>

                <Link href={`/memorial/${persona.id}`} style={{ 
                  marginTop: 'auto',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, var(--accent-primary), #6366f1)',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(var(--accent-primary-rgb), 0.2)'
                }}>
                  {t('public.visit')}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-tertiary)', borderRadius: '24px' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
              {t('public.noPublic')}
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
      `}</style>
    </div>
  );
}
