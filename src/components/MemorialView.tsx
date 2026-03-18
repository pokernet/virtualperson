'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import DigitalCandle from './DigitalCandle';
import TributeWall from './TributeWall';
import { lightCandle, postTribute, updateBio, uploadMemorialImage, deleteMemorialImage, updateMemorialDates } from '@/app/memorial/actions';

interface MemorialViewProps {
  memorial: any;
  persona: any;
  messages: any[];
  images: any[];
  isOwner: boolean;
}

const MemorialView: React.FC<MemorialViewProps> = ({ 
  memorial, 
  persona, 
  messages, 
  images, 
  isOwner 
}) => {
  const { t, isRTL } = useLanguage();
  const [bio, setBio] = useState(memorial.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [birthDate, setBirthDate] = useState(memorial.birth_date || '');
  const [deathDate, setDeathDate] = useState(memorial.death_date || '');
  const [isEditingDates, setIsEditingDates] = useState(false);

  const handleSaveBio = async () => {
    await updateBio(memorial.id, bio);
    setIsEditingBio(false);
  };

  const handleSaveDates = async () => {
    await updateMemorialDates(memorial.id, birthDate, deathDate);
    setIsEditingDates(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      await uploadMemorialImage(memorial.id, formData);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          {isRTL ? '→ חזרה ללוח הבקרה' : '← Back to Dashboard'}
        </Link>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          margin: '0 auto 1.5rem',
          border: '4px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}>
          {persona.avatar_url ? (
            <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              {persona.name.charAt(0)}
            </div>
          )}
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{persona.name}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {persona.relationship}
        </p>
      </header>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Bio and Tributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Biography */}
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{isRTL ? 'לזכרו' : 'In Loving Memory'}</h2>
              {isOwner && (
                <button 
                  onClick={() => isEditingBio ? handleSaveBio() : setIsEditingBio(true)}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                >
                  {isEditingBio ? (isRTL ? 'שמור' : 'Save') : (isRTL ? 'ערוך ביוגרפיה' : 'Edit Bio')}
                </button>
              )}
            </div>
            {isEditingBio ? (
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  minHeight: '200px',
                  resize: 'vertical',
                  textAlign: isRTL ? 'right' : 'left'
                }}
              />
            ) : (
              <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', textAlign: isRTL ? 'right' : 'left' }}>
                {bio || (isRTL ? 'טרם נוספה ביוגרפיה.' : 'No biography added yet.')}
              </p>
            )}
          </section>

          {/* Gallery */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{isRTL ? 'גלריה' : 'Gallery'}</h2>
              {isOwner && (
                <label className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}>
                  {isUploading ? (isRTL ? 'מעלה...' : 'Uploading...') : (isRTL ? 'הוסף תמונה' : 'Add Photo')}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              )}
            </div>
            {images.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                {images.map((img) => (
                  <div key={img.id} style={{ 
                    aspectRatio: '1', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    position: 'relative'
                  }}>
                    <img src={img.url} alt="Memorial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isOwner && (
                      <button 
                        onClick={() => deleteMemorialImage(memorial.id, img.id, img.url)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: isRTL ? 'auto' : '8px',
                          left: isRTL ? '8px' : 'auto',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                        }}
                        title="Delete Image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
                {isRTL ? 'אין תמונות בגלריה עדיין.' : 'No photos in the gallery yet.'}
              </p>
            )}
          </section>

          {/* Tribute Wall */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>{isRTL ? 'הספדים ומילים לזכרם' : 'Tributes'}</h2>
            <TributeWall 
              memorialId={memorial.id}
              initialMessages={messages}
              onPost={(content, name) => postTribute(memorial.id, content, name)}
              isRTL={isRTL}
            />
          </section>
        </div>

        {/* Right Column: Candle and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <DigitalCandle 
            count={memorial.candle_count} 
            onLight={() => lightCandle(memorial.id)} 
            isRTL={isRTL}
          />

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{isRTL ? 'פרטים' : 'Details'}</h3>
                {isOwner && (
                    <button 
                        onClick={() => isEditingDates ? handleSaveDates() : setIsEditingDates(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        {isEditingDates ? (isRTL ? 'שמור' : 'Save') : (isRTL ? 'ערוך' : 'Edit')}
                    </button>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isRTL ? 'תאריך לידה' : 'Born'}</span>
                {isEditingDates ? (
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', padding: '2px 4px' }} />
                ) : (
                    <span>{birthDate || (isRTL ? 'לא ידוע' : 'Unknown')}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isRTL ? 'נפטר/ה' : 'Departed'}</span>
                {isEditingDates ? (
                    <input type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', padding: '2px 4px' }} />
                ) : (
                    <span>{deathDate || (isRTL ? 'לא ידוע' : 'Unknown')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialView;
