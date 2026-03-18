'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/utils/i18n/LanguageContext';

interface Message {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
  user_id: string | null;
  is_approved: boolean;
}

interface TributeWallProps {
  memorialId: string;
  initialMessages: Message[];
  onPost: (content: string, name?: string) => Promise<Message>;
  isRTL?: boolean;
  isOwner?: boolean;
  onApprove?: (id: string) => Promise<void>;
}

const TributeWall: React.FC<TributeWallProps> = ({ memorialId, initialMessages, onPost, isRTL, isOwner, onApprove }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newContent, setNewContent] = useState('');
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const msg = await onPost(newContent, newName || undefined);
      setMessages([msg, ...messages]);
      setNewContent('');
      setNewName('');
    } catch (error) {
      console.error('Failed to post tribute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tribute-wall-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>{t('tributes.title')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('tributes.nameLabel')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              textAlign: isRTL ? 'right' : 'left'
            }}
          />
          <textarea 
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={t('tributes.contentPlaceholder')}
            required
            rows={3}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              resize: 'none',
              textAlign: isRTL ? 'right' : 'left'
            }}
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newContent.trim()}
            className="btn-primary tribute-submit-btn" 
            style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end', padding: '0.6rem 1.5rem', minWidth: '120px' }}
          >
            {isSubmitting ? t('tributes.posting') : t('tributes.postBtn')}
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length > 0 ? messages.map((msg) => (
          <div key={msg.id} className="glass-panel tribute-card" style={{ padding: '1rem 1.5rem', borderRadius: '12px', position: 'relative' }}>
            {isOwner && !msg.is_approved && (
                <div style={{ 
                    position: 'absolute',
                    top: '12px',
                    right: isRTL ? 'auto' : '12px',
                    left: isRTL ? '12px' : 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <span style={{ fontSize: '0.7rem', color: '#ff9800', background: 'rgba(255, 152, 0, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {t('tributes.pending')}
                    </span>
                    <button 
                        onClick={() => {
                            onApprove?.(msg.id);
                            setMessages(messages.map(m => m.id === msg.id ? { ...m, is_approved: true } : m));
                        }}
                        style={{
                            padding: '2px 10px',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        {t('tributes.approve')}
                    </button>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--accent-primary)' }}>{msg.author_name || t('tributes.anonymous')}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap', margin: 0 }}>
              {msg.content}
            </p>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            {t('tributes.noTributes')}
          </p>
        )}
      </div>
    </div>
  );
};

export default TributeWall;
