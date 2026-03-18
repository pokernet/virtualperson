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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header with Switcher */}
      <header style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: 10
      }}>
        <LanguageSwitcher />
      </header>

      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main className="glass-panel" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '800px',
        width: '100%',
        padding: '3rem',
        borderRadius: '24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, var(--text-primary), var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Eternity AI
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {t('landing.subtitle')}
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <Link href="/login" className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', display: 'inline-block' }}>
            {t('landing.getStarted')}
          </Link>
          <button className="btn-secondary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}>
            {t('landing.footer')}
          </button>
        </div>
      </main>
    </div>
  );
}

