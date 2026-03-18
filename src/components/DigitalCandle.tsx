'use client';

import React, { useState } from 'react';

interface DigitalCandleProps {
  count: number;
  onLight: () => Promise<void>;
  isOwner?: boolean;
  isRTL?: boolean;
}

const DigitalCandle: React.FC<DigitalCandleProps> = ({ count, onLight, isOwner, isRTL }) => {
  const [localCount, setLocalCount] = useState(count);
  const [isLighting, setIsLighting] = useState(false);

  const handleLight = async () => {
    if (isLighting) return;
    setIsLighting(true);
    setLocalCount(prev => prev + 1);
    try {
      await onLight();
    } catch (error) {
      setLocalCount(prev => prev - 1);
      console.error('Failed to light candle:', error);
    } finally {
      setTimeout(() => setIsLighting(false), 1000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      background: 'rgba(255, 152, 0, 0.05)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 152, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative', width: '60px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        {/* Candle Body */}
        <div style={{
          width: '30px',
          height: '60px',
          background: 'linear-gradient(to bottom, #fff, #f4f4f4)',
          borderRadius: '4px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }} />
        
        {/* Flame */}
        <div style={{
          position: 'absolute',
          bottom: '62px',
          width: '16px',
          height: '24px',
          background: 'radial-gradient(ellipse at bottom, #ff9800, #ff5722)',
          borderRadius: '50% 50% 20% 20%',
          boxShadow: '0 0 15px #ff9800, 0 0 30px #ff5722',
          animation: 'flicker 0.1s infinite alternate',
          opacity: localCount > 0 ? 1 : 0.2,
          transition: 'opacity 0.5s'
        }} />
      </div>

      <style jsx>{`
        @keyframes flicker {
          0% { transform: scale(1) skewX(1deg); }
          100% { transform: scale(1.1) skewX(-1deg); }
        }
      `}</style>

      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.25rem' }}>
          {isRTL ? `${localCount} נרות הודלקו` : `${localCount} Candles Lit`}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isRTL ? 'הדליקו נר לזכרו' : 'Light a candle in memory'}
        </p>
      </div>

      <button 
        onClick={handleLight}
        disabled={isLighting}
        className="btn-primary" 
        style={{ 
          padding: '0.6rem 1.5rem', 
          fontSize: '0.9rem',
          background: 'linear-gradient(135deg, #ff9800, #ff5722)',
          boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
        }}
      >
        {isLighting ? (isRTL ? 'מדליק נר...' : 'Lighting...') : (isRTL ? 'הדלק נר זיכרון' : 'Light a Candle')}
      </button>
    </div>
  );
};

export default DigitalCandle;
