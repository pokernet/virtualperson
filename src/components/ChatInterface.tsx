'use client';

import { useChat } from '@ai-sdk/react';
import { type Message } from 'ai';
import { useEffect, useRef, useState } from 'react';

interface ChatInterfaceProps {
  personaId: string;
  personaName: string;
  systemPrompt: string;
}

export default function ChatInterface({ personaId, personaName, systemPrompt }: ChatInterfaceProps) {
  const [isVisualizing, setIsVisualizing] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: {
      systemPrompt,
      modelPref: 'openai' // In a full app, this comes from user settings
    },
    // You could load initial messages from Supabase here
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Hello. I'm here. It's good to talk to you.`
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVisualize = async () => {
    if (messages.length === 0 || isVisualizing) return;
    setIsVisualizing(true);
    try {
      const res = await fetch('/api/imagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, personaName })
      });
      const data = await res.json();
      if (data.imageUrl) {
        append({
          role: 'assistant',
          content: `Here is a visualization of that memory:\n\n![Memory Visualization](${data.imageUrl})`
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVisualizing(false);
    }
  };

  const renderContent = (content: string) => {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const parts = [];
    let lastIdx = 0;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={lastIdx} style={{ whiteSpace: 'pre-wrap' }}>{content.slice(lastIdx, match.index)}</span>);
      }
      parts.push(
        <img key={match.index} src={match[1]} alt="Generated Memory" style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '1rem', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} />
      );
      lastIdx = imgRegex.lastIndex;
    }
    if (lastIdx < content.length) {
      parts.push(<span key={lastIdx} style={{ whiteSpace: 'pre-wrap' }}>{content.slice(lastIdx)}</span>);
    }
    
    if (parts.length === 0) return <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>;
    return <>{parts}</>;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 100px)', // Leave room for header
      maxWidth: '800px',
      margin: '0 auto',
      background: 'var(--surface-glass)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--surface-glass-border)',
      borderRadius: '24px',
      overflow: 'hidden'
    }}>
      {/* Chat Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {messages.map((m: Message) => (
          <div key={m.id} style={{
            display: 'flex',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: m.role === 'user' ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              flexShrink: 0
            }}>
              {m.role === 'user' ? 'U' : personaName.charAt(0).toUpperCase()}
            </div>

            {/* Message Bubble */}
            <div style={{
              background: m.role === 'user' ? 'var(--bg-tertiary)' : 'rgba(129, 140, 248, 0.1)',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              borderTopRightRadius: m.role === 'user' ? '4px' : '16px',
              borderTopLeftRadius: m.role === 'assistant' ? '4px' : '16px',
              maxWidth: '80%',
              lineHeight: '1.6',
              color: 'var(--text-primary)'
            }}>
              {renderContent(m.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            color: 'var(--text-secondary)'
          }}>
             <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {personaName.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>is thinking...</div>
          </div>
        )}
        {isVisualizing && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            color: 'var(--text-secondary)'
          }}>
             <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>visualizing a memory...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Say something to ${personaName}...`}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="btn-primary" style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            opacity: (isLoading || !input.trim()) ? 0.5 : 1
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button 
            onClick={handleVisualize} 
            disabled={isVisualizing || messages.length < 2 || isLoading}
            style={{
              background: 'transparent',
              color: 'var(--accent-secondary)',
              border: '1px solid var(--border-highlight)',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              cursor: (isVisualizing || messages.length < 2 || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (isVisualizing || messages.length < 2 || isLoading) ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Visualize Current Memory
          </button>
        </div>
      </div>
    </div>
  );
}
