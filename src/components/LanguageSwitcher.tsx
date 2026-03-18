'use client';

import { useLanguage } from '@/utils/i18n/LanguageContext';
import { Language } from '@/utils/i18n/translations';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)',
          borderRadius: '999px',
          padding: '0.4rem 0.8rem',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          fontWeight: '500'
        }}
      >
        <span>{currentLang.flag}</span>
        <span style={{ display: 'none' }}>{currentLang.name}</span>
        <svg 
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
            style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s'
            }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          [isRTL ? 'left' : 'right']: 0,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '0.5rem',
          minWidth: '140px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          animation: 'scaleIn 0.2s ease forwards'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                border: 'none',
                background: language === lang.code ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '10px',
                color: language === lang.code ? 'var(--accent-primary)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                textAlign: isRTL ? 'right' : 'left',
                fontSize: '0.9rem',
                transition: 'all 0.15s',
                fontWeight: language === lang.code ? '600' : '400'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
              <span style={{ flex: 1 }}>{lang.name}</span>
              {language === lang.code && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
