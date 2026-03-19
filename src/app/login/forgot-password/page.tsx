'use client';

import { requestPasswordReset } from '../actions'
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ForgotPasswordForm() {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');

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
          {t('forgotPassword.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('forgotPassword.subtitle')}</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#fb7185',
          borderRadius: '12px',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {success ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
                padding: '1rem',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                color: '#4ade80',
                borderRadius: '12px',
                fontSize: '0.9rem'
            }}>
                {t('forgotPassword.success')}
            </div>
            <Link href="/login" className="btn-secondary" style={{ width: '100%' }}>
                {t('forgotPassword.backToLogin')}
            </Link>
        </div>
      ) : (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('forgotPassword.emailLabel')}
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
                textAlign: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button formAction={requestPasswordReset} className="btn-primary" style={{ width: '100%' }}>
              {t('forgotPassword.sendButton')}
            </button>
            <Link href="/login" style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                color: 'var(--text-muted)', 
                textDecoration: 'none',
                marginTop: '0.5rem'
            }}>
                {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}

export default function ForgotPasswordPage() {
  const { isRTL } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <header style={{
        position: 'absolute',
        top: '2rem',
        [isRTL ? 'left' : 'right']: '2rem',
        zIndex: 10
      }}>
        <LanguageSwitcher />
      </header>

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
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}
