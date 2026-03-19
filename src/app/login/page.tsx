'use client';

import { login, signup, signInWithGoogle } from './actions'
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function LoginForm() {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="glass-panel" style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: '440px',
      padding: '3rem 2rem',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          background: 'linear-gradient(135deg, var(--text-primary), var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          {t('login.welcome')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('login.subtitle')}</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#fb7185',
          borderRadius: '12px',
          fontSize: '0.875rem',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          {error}
        </div>
      )}

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('login.emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                textAlign: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('login.passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                textAlign: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: isRTL ? 'flex-start' : 'flex-end', marginTop: '-0.5rem' }}>
            <Link 
              href="/login/forgot-password" 
              style={{ 
                fontSize: '0.85rem', 
                color: 'var(--accent-primary)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              {t('login.forgotPassword')}
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button formAction={login} className="btn-primary" style={{ width: '100%' }}>
              {t('login.signIn')}
            </button>
            <button formAction={signup} className="btn-secondary" style={{ width: '100%' }}>
              {t('login.signUp')}
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isRTL ? 'או' : 'OR'}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <button 
          onClick={() => signInWithGoogle()}
          className="btn-secondary" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          {t('login.signInWithGoogle')}
        </button>
      </main>
    );
}

export default function LoginPage() {
  const { isRTL } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Top Header with Switcher */}
      <header style={{
        position: 'absolute',
        top: '2rem',
        [isRTL ? 'left' : 'right']: '2rem',
        zIndex: 10
      }}>
        <LanguageSwitcher />
      </header>

      {/* Subtle Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

