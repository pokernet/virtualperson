'use client';

import { updatePassword } from '../actions'
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordForm() {
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
          {t('forgotPassword.newPasswordTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('forgotPassword.newPasswordSubtitle')}</p>
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

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {t('forgotPassword.newPasswordLabel')}
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
              textAlign: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <button formAction={updatePassword} className="btn-primary" style={{ width: '100%' }}>
            {t('forgotPassword.updateButton')}
          </button>
        </div>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
