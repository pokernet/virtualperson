'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AnimatedAvatar from '@/components/AnimatedAvatar';

// Define Message type since we can't get it from ai/react easily
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
}

interface ChatInterfaceProps {
  personaId: string;
  personaName: string;
  avatarUrl?: string;
  systemPrompt: string;
  age?: number | null;
  sex?: string | null;
  initialMessages?: Message[];
}

export default function ChatInterface({ 
  personaId, 
  personaName, 
  avatarUrl,
  systemPrompt, 
  age,
  sex,
  initialMessages = [] 
}: ChatInterfaceProps) {
  const { t, isRTL } = useLanguage();
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [input, setInput] = useState('');
  
  const chat = useChat({
    // @ts-ignore
    api: '/api/chat',
    body: {
      systemPrompt,
      personaId,
      modelPref: 'openai'
    },
    initialMessages: (initialMessages.length > 0 ? initialMessages : [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: t('chat.welcomeMsg')
      }
    ]) as any
  });

  const { messages, status, error, sendMessage, setMessages } = chat as any;
  const isLoading = status === 'submitted' || status === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // In this headless version, we can try passing the body metadata if sendMessage supports it,
    // or just rely on the initial body if the SDK is configured correctly.
    // However, the server was getting null personaId, so we'll try to follow the SDK's metadata pattern.
    sendMessage({ 
      text: input,
      // Metadata might be passed differently depending on the version
      metadata: { personaId, systemPrompt } 
    });
    
    setInput('');
  };

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
        setMessages([
          ...messages,
          {
            id: `visualization-${Date.now()}`,
            role: 'assistant',
            content: `${t('chat.visualizationSent')}\n\n![Memory Visualization](${data.imageUrl})`
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVisualizing(false);
    }
  };

  const renderContent = (m: any) => {
    let content = m.content || '';
    
    // Robust extraction for newest AI SDK versions (uses 'parts' instead of 'content')
    if (!content && m.parts) {
      content = m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('\n');
    }

    if (!content) return null;

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
    
    if (parts.length === 0) return <span style={{ whiteSpace: 'pre-wrap', textAlign: 'inherit' }}>{content}</span>;
    return <>{parts}</>;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      gap: '2rem',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        {/* Left/Start Side Group: Back button and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          <Link href="/dashboard" style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s',
            flexShrink: 0
          }} title={t('common.dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ 
                fontSize: '1.15rem', 
                fontWeight: '600', 
                margin: 0, 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {personaName}
              </h1>
              <span style={{ 
                fontSize: '0.6rem', 
                fontWeight: '700', 
                background: 'rgba(255,255,255,0.1)', 
                color: 'var(--text-secondary)', 
                padding: '1px 4px', 
                borderRadius: '4px',
                border: '1px solid var(--border-color)'
              }}>BETA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <div style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#4ADE80', 
                boxShadow: '0 0 8px #4ADE80',
                flexShrink: 0 
              }} />
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                {t('chat.portalActive')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right/End Side Group: Persona Tools, Avatar, and Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRTL ? 'flex-start' : 'flex-end', gap: '2px' }}>
              <Link href={`/wizard?id=${personaId}`} style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(129, 140, 248, 0.1)',
                  transition: 'background 0.2s'
              }}>
                  {t('chat.editPersona')}
              </Link>
            </div>

            <AnimatedAvatar 
              src={avatarUrl} 
              name={personaName} 
              age={age} 
              sex={sex} 
              size={42} 
              isTalking={isLoading} 
            />
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />
          <LanguageSwitcher />
        </div>
      </header>



      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        maxHeight: 'calc(100vh - 160px)',
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
        gap: '1.5rem',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        {messages.map((m: any) => (
          <div key={m.id} style={{
            display: 'flex',
            flexDirection: m.role === 'user' ? (isRTL ? 'row' : 'row-reverse') : (isRTL ? 'row-reverse' : 'row'),
            alignItems: 'flex-start',
            gap: '1rem',
            animation: 'fadeIn 0.5s ease forwards'
          }}>
            {/* Avatar */}
            <AnimatedAvatar 
              src={m.role === 'user' ? null : avatarUrl} 
              name={m.role === 'user' ? 'Me' : personaName} 
              age={m.role === 'user' ? null : age} 
              sex={m.role === 'user' ? null : sex} 
              size={40} 
              isTalking={m.role === 'assistant' && isLoading && m.id === messages[messages.length - 1]?.id} 
            />

            {/* Message Bubble */}
            <div style={{
              maxWidth: '80%',
              padding: '1rem 1.25rem',
              borderRadius: '18px',
              borderTopLeftRadius: (m.role === 'assistant' && !isRTL) || (m.role === 'user' && isRTL) ? '2px' : '18px',
              borderTopRightRadius: (m.role === 'user' && !isRTL) || (m.role === 'assistant' && isRTL) ? '2px' : '18px',
              background: m.role === 'user' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              lineHeight: '1.5',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {renderContent(m)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ 
              display: 'flex', 
              gap: '8px', 
              padding: '1rem', 
              color: 'var(--text-muted)',
              flexDirection: isRTL ? 'row-reverse' : 'row'
          }}>
            <span className="fade-in" style={{ animationDelay: '0s' }}>.</span>
            <span className="fade-in" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="fade-in" style={{ animationDelay: '0.4s' }}>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1.5rem 2rem',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
                onClick={handleVisualize}
                disabled={isVisualizing || messages.length === 0}
                className={`btn-secondary ${isVisualizing ? 'btn-loading' : ''}`}
                style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: (isVisualizing || messages.length === 0) ? 0.5 : 1,
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
                {isVisualizing ? t('chat.visualizing') : t('chat.visualize')}
            </button>
        </div>


        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '1rem',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={t('chat.inputPlaceholder', { name: personaName })}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem',
              textAlign: 'inherit'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className={`btn-primary ${isLoading ? 'btn-loading' : ''}`} 
            style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            opacity: (isLoading || !input.trim()) ? 0.5 : 1,
            transform: isRTL ? 'rotate(180deg)' : 'none'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}


