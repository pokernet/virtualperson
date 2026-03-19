'use client';

import Link from 'next/link';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(192, 132, 252, 0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Navigation Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10, 10, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Eternity AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/public" style={{ 
            fontSize: '0.95rem', 
            color: 'var(--text-secondary)',
            fontWeight: '500',
            transition: 'color 0.2s ease'
          }} className="nav-link">
            {t('landing.viewMemorials')}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        zIndex: 1
      }}>
        <div className="fade-in" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.25rem',
            borderRadius: '999px',
            background: 'rgba(129, 140, 248, 0.1)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '2rem'
          }}>
            {t('common.poweredBy')}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to bottom right, #fff 30%, rgba(255,255,255,0.4))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}>
            {t('landing.title')}
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '650px',
            margin: '0 auto 3rem',
            fontWeight: '400'
          }}>
            {t('landing.subtitle')}
          </p>

          <div className="cta-container" style={{
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Link href="/login" className="btn-primary" style={{ 
              fontSize: '1.1rem', 
              padding: '1rem 3rem',
              minWidth: '220px',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(129, 140, 248, 0.4)'
            }}>
              {t('landing.getStarted')}
            </Link>
            
            <Link href="/public" className="btn-secondary" style={{ 
              fontSize: '1.1rem', 
              padding: '1rem 3rem',
              minWidth: '220px',
              textAlign: 'center',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(5px)'
            }}>
              {t('landing.viewMemorials')}
            </Link>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(10, 10, 12, 0.3)',
        zIndex: 5
      }}>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--text-muted)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {t('landing.footer')}
        </p>
      </footer>

      <style jsx>{`
        .nav-link:hover {
          color: var(--text-primary) !important;
        }
        .cta-container {
          flex-direction: row;
        }
        @media (max-width: 640px) {
          .cta-container {
            flex-direction: column;
            width: 100%;
          }
          .cta-container :global(a) {
            width: 100%;
          }
        }
        @media (min-width: 640px) {
          main { padding-top: 6rem; }
        }
      `}</style>
    </div>
  );
}

