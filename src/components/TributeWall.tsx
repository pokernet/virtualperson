'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
  user_id: string | null;
}

interface TributeWallProps {
  memorialId: string;
  initialMessages: Message[];
  onPost: (content: string, name?: string) => Promise<Message>;
  isRTL?: boolean;
}

const TributeWall: React.FC<TributeWallProps> = ({ memorialId, initialMessages, onPost, isRTL }) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>{isRTL ? 'כתבו הספד / מילים לזכרו' : 'Leave a Tribute'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={isRTL ? 'שמך (אופציונלי)' : 'Your Name (Optional)'}
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
            placeholder={isRTL ? 'שתפו זיכרון או מסר...' : 'Share a memory or message...'}
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
            className="btn-primary" 
            style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end', padding: '0.6rem 1.5rem' }}
          >
            {isSubmitting ? (isRTL ? 'מעלה...' : 'Posting...') : (isRTL ? 'שלח מילים' : 'Post Tribute')}
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length > 0 ? messages.map((msg) => (
          <div key={msg.id} className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>{msg.author_name || 'Anonymous'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </p>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No tributes yet. Be the first to share a memory.
          </p>
        )}
      </div>
    </div>
  );
};

export default TributeWall;
