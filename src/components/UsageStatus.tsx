'use client';

import React from 'react';

interface UsageStatusProps {
  openaiTokens: number;
  anthropicTokens: number;
  localTokens: number;
  status: string;
}

const UsageStatus: React.FC<UsageStatusProps> = ({ 
  openaiTokens, 
  anthropicTokens, 
  localTokens, 
  status 
}) => {
  return (
    <div className="glass-panel" style={{
      padding: '0.4rem 0.75rem',
      borderRadius: '999px',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      border: '1px solid var(--border-color)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Account Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        backgroundColor: status === 'Active' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255, 152, 0, 0.1)',
        color: status === 'Active' ? 'var(--accent-primary)' : '#FF9800',
        fontWeight: '600',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        fontSize: '0.7rem'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: status === 'Active' ? 'currentColor' : '#FF9800',
          boxShadow: status === 'Active' ? '0 0 8px currentColor' : 'none'
        }} />
        {status}
      </div>

      <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />

      {/* Token Usage Breakdown */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {/* OpenAI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="OpenAI Usage">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.7 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
          </svg>
          <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{openaiTokens.toLocaleString()}</span>
        </div>

        {/* Anthropic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Anthropic Usage">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.7 }}>
            <path d="M4.5 16.5c-1.5 1.26-2 3.5-2 3.5s2.24-.5 3.5-2" />
            <path d="m8 10 3 3-3 3" />
            <path d="M8 6c0 1 0 3 0 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{anthropicTokens.toLocaleString()}</span>
        </div>

        {/* Local */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Local Usage">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.7 }}>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h10M7 12h10M7 17h10" />
          </svg>
          <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{localTokens.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default UsageStatus;
