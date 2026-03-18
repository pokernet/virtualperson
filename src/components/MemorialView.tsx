'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import DigitalCandle from './DigitalCandle';
import TributeWall from './TributeWall';
import { lightCandle, postTribute, updateBio, uploadMemorialImage, deleteMemorialImage, updateMemorialDates, approveTribute } from '@/app/memorial/actions';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [bio, setBio] = useState(memorial.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [birthDate, setBirthDate] = useState(memorial.birth_date || '');
  const [deathDate, setDeathDate] = useState(memorial.death_date || '');
  const [isEditingDates, setIsEditingDates] = useState(false);

  const handleApprove = async (msgId: string) => {
    await approveTribute(memorial.id, msgId);
  };

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
    <div className="memorial-container" style={{
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
      <header className="memorial-header" style={{ textAlign: 'center' }}>
        <Link href="/dashboard" className="back-link" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block', textDecoration: 'none' }}>
          {isRTL ? `← ${t('memorial.backToDashboard')}` : `← ${t('memorial.backToDashboard')}`}
        </Link>
        <div className="memorial-avatar" style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          margin: '0 auto 1.5rem',
          border: '4px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          background: 'var(--bg-tertiary)'
        }}>
          {persona.avatar_url ? (
            <img src={persona.avatar_url} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              {persona.name.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="memorial-name" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>{persona.name}</h1>
        <p className="memorial-relationship" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {persona.relationship}
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="memorial-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Bio and Tributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Biography */}
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{t('memorial.inLovingMemory')}</h2>
              {isOwner && (
                <button 
                  onClick={() => isEditingBio ? handleSaveBio() : setIsEditingBio(true)}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                >
                  {isEditingBio ? t('memorial.save') : t('memorial.editBio')}
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
                {bio || t('memorial.noBio')}
              </p>
            )}
          </section>

          {/* Gallery */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{t('memorial.gallery')}</h2>
              {isOwner && (
                <label className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}>
                  {isUploading ? t('memorial.uploading') : t('memorial.addPhoto')}
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
                {t('memorial.noPhotos')}
              </p>
            )}
          </section>

          {/* Tribute Wall */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>{t('memorial.tributes')}</h2>
            <TributeWall 
              memorialId={memorial.id}
              initialMessages={isOwner ? messages : messages.filter((m: any) => m.is_approved)}
              onPost={(content, name) => postTribute(memorial.id, content, name)}
              isRTL={isRTL}
              isOwner={isOwner}
              onApprove={handleApprove}
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{t('memorial.details')}</h3>
                {isOwner && (
                    <button 
                        onClick={() => isEditingDates ? handleSaveDates() : setIsEditingDates(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        {isEditingDates ? t('memorial.save') : t('common.edit')}
                    </button>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('memorial.born')}</span>
                {isEditingDates ? (
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', padding: '2px 4px' }} />
                ) : (
                    <span>{birthDate || t('memorial.unknown')}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('memorial.departed')}</span>
                {isEditingDates ? (
                    <input type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'white', padding: '2px 4px' }} />
                ) : (
                    <span>{deathDate || t('memorial.unknown')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) {
          .memorial-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .memorial-container {
            padding: 1.5rem !important;
          }
          .memorial-avatar {
            width: 90px !important;
            height: 90px !important;
          }
          .memorial-name {
            font-size: 1.8rem !important;
          }
          .memorial-relationship {
            font-size: 1rem !important;
          }
          .back-link {
            padding: 0.5rem 1rem !important;
            background: rgba(255,255,255,0.05) !important;
            border-radius: 20px !important;
          }
          .tribute-submit-btn {
            align-self: stretch !important;
            width: 100% !important;
          }
          .tribute-card {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MemorialView;
