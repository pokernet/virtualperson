'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';

// Define Message type since we can't get it from ai/react easily
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
}

interface ChatInterfaceProps {
  personaId: string;
  personaName: string;
  systemPrompt: string;
  initialMessages?: Message[];
}

export default function ChatInterface({ 
  personaId, 
  personaName, 
  systemPrompt, 
  initialMessages = [] 
}: ChatInterfaceProps) {
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
        content: `Hello. I am here. It's good to talk to you.`
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
            content: `Here is a visualization of that memory:\n\n![Memory Visualization](${data.imageUrl})`
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
    
    if (parts.length === 0) return <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>;
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
      gap: '2rem'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0.5rem 1.5rem 0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/dashboard" style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.2s'
          }} title="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Conversation</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Eternity Portal Active</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{personaName}</h2>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center', marginTop: '2px' }}>
              <Link href={`/wizard?id=${personaId}`} style={{ 
                fontSize: '0.75rem', 
                color: 'var(--accent-primary)',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Edit Persona
              </Link>
            </div>
          </div>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            background: 'var(--bg-tertiary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.1rem',
            fontWeight: '600',
            border: '2px solid var(--border-color)'
          }}>
            {personaName.charAt(0).toUpperCase()}
          </div>
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
        gap: '1.5rem'
      }}>
        {messages.map((m: any) => (
          <div key={m.id} style={{
            display: 'flex',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '1rem',
            animation: 'fadeIn 0.5s ease forwards'
          }}>
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: '600',
              flexShrink: 0,
              boxShadow: 'var(--shadow-glow)'
            }}>
              {m.role === 'user' ? 'U' : personaName.charAt(0)}
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '80%',
              padding: '1rem 1.25rem',
              borderRadius: '18px',
              borderTopLeftRadius: m.role === 'assistant' ? '2px' : '18px',
              borderTopRightRadius: m.role === 'user' ? '2px' : '18px',
              background: m.role === 'user' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              lineHeight: '1.5',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {renderContent(m)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', padding: '1rem', color: 'var(--text-muted)' }}>
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
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
                onClick={handleVisualize}
                disabled={isVisualizing || messages.length === 0}
                className="btn-secondary"
                style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: (isVisualizing || messages.length === 0) ? 0.5 : 1
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
                {isVisualizing ? 'Visualizing...' : 'Visualize Current Memory'}
            </button>
        </div>


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
      </div>
      </div>
    </div>
  );
}

