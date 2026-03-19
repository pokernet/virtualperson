'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { createPersona } from './actions';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface PersonaData {
  id: string;
  name: string;
  relationship: string;
  traits: string;
  catchphrases: string;
  memories: string;
  avatar_url?: string;
  age?: number;
  sex?: string;
}

export default function WizardClient({ 
  personaData, 
  user 
}: { 
  personaData: PersonaData | null, 
  user: any 
}) {
  const { t, isRTL } = useLanguage();
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
      gap: '2rem',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <Link href="/dashboard" style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
            }}>
            {isRTL ? '→' : '←'} {t('common.back')}
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
            {isEditing ? t('common.editProfile') : t('common.createProfile')}
            </h1>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="glass-panel" style={{
        padding: '3rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        opacity: isSubmitting ? 0.7 : 1,
        pointerEvents: isSubmitting ? 'none' : 'auto',
        transition: 'opacity 0.2s',
        textAlign: isRTL ? 'right' : 'left'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            {isEditing 
                ? t('wizard.editTitle', { name: personaData.name }) 
                : t('wizard.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isEditing 
              ? t('wizard.editSubtitle')
              : t('wizard.subtitle')}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="age" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {t('wizard.ageLabel') || 'Age'}
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                defaultValue={personaData?.age || ''}
                placeholder="e.g. 25"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="sex" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {t('wizard.sexLabel') || 'Sex'}
              </label>
              <select
                id="sex"
                name="sex"
                defaultValue={personaData?.sex || ''}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  appearance: 'none',
                  backgroundColor: 'var(--bg-tertiary)'
                }}
              >
                <option value="">{t('common.select') || 'Select'}</option>
                <option value="male">{t('common.male') || 'Male'}</option>
                <option value="female">{t('common.female') || 'Female'}</option>
                <option value="other">{t('common.other') || 'Other'}</option>
              </select>
            </div>
          </div>
          
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
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t('wizard.photoLabel')}</p>
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
                {isEditing ? t('wizard.changePhoto') : t('wizard.uploadPhoto')}
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
                {t('wizard.nameLabel')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={personaData?.name || ''}
                placeholder={t('wizard.namePlaceholder')}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="relationship" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {t('wizard.relationshipLabel')}
              </label>
              <input
                id="relationship"
                name="relationship"
                type="text"
                required
                defaultValue={personaData?.relationship || ''}
                placeholder={t('wizard.relationshipPlaceholder')}
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="traits" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {t('wizard.traitsLabel')}
            </label>
            <textarea
              id="traits"
              name="traits"
              required
              rows={3}
              defaultValue={personaData?.traits || ''}
              placeholder={t('wizard.traitsPlaceholder')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                textAlign: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="catchphrases" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {t('wizard.catchphrasesLabel')}
            </label>
            <textarea
              id="catchphrases"
              name="catchphrases"
              rows={2}
              defaultValue={personaData?.catchphrases || ''}
              placeholder={t('wizard.catchphrasesPlaceholder')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                textAlign: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="memories" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {t('wizard.memoriesLabel')}
            </label>
            <textarea
              id="memories"
              name="memories"
              required
              rows={4}
              defaultValue={personaData?.memories || ''}
              placeholder={t('wizard.memoriesPlaceholder')}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                textAlign: 'inherit'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`btn-primary ${isSubmitting ? 'btn-loading' : ''}`} 
            style={{ 
                marginTop: '1rem', 
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            {isSubmitting 
              ? t('common.saving') 
              : (isEditing ? t('wizard.submitEdit') : t('wizard.submitCreate'))}
          </button>
        </form>
      </main>
    </div>
  )
}

