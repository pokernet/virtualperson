'use client';

interface AnimatedAvatarProps {
  src?: string | null;
  name: string;
  age?: number | null;
  sex?: string | null;
  size?: number;
  isTalking?: boolean;
}

export default function AnimatedAvatar({
  src,
  name,
  age,
  sex,
  size = 40,
  isTalking = false
}: AnimatedAvatarProps) {
  // Determine animation style based on age
  let animationClass = '';
  if (age !== undefined && age !== null) {
    if (age <= 12) {
      animationClass = 'animate-child';
    } else if (age >= 65) {
      animationClass = 'animate-elderly';
    } else {
      animationClass = 'animate-adult';
    }
  } else {
    animationClass = 'animate-adult'; // Default
  }

  // Determine glow color based on sex (optional polish)
  const glowColor = sex === 'male' ? 'rgba(59, 130, 246, 0.5)' : 
                   sex === 'female' ? 'rgba(236, 72, 153, 0.5)' : 
                   'rgba(129, 140, 248, 0.5)';

  return (
    <div 
      className={`avatar-container ${isTalking ? 'is-talking' : ''} ${animationClass}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        overflow: 'visible', // Allow glow/rings to show outside
        boxShadow: `0 0 15px ${glowColor}`
      }}
    >
      {/* Universal Talking Rings */}
      {isTalking && (
        <>
          <div className="talking-ring ring-1" />
          <div className="talking-ring ring-2" />
        </>
      )}

      {/* Main Image */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        background: 'inherit'
      }}>
        {src ? (
          <img 
            src={src} 
            alt={name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ fontSize: `${size * 0.4}px`, fontWeight: '600', color: 'var(--text-secondary)' }}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <style jsx>{`
        .avatar-container {
          transition: transform 0.3s ease;
        }

        /* Age-based Animations */
        .animate-child {
          animation: childPulse 2s infinite ease-in-out;
        }
        .animate-adult {
          animation: adultPulse 4s infinite ease-in-out;
        }
        .animate-elderly {
          animation: elderlyPulse 8s infinite ease-in-out;
        }

        @keyframes childPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes adultPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes elderlyPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.01); }
        }

        /* Talking Visuals */
        .talking-ring {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid var(--accent-primary);
          opacity: 0;
          z-index: 1;
        }
        .ring-1 {
          animation: ripple 1.5s infinite ease-out;
        }
        .ring-2 {
          animation: ripple 1.5s infinite ease-out 0.75s;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .is-talking {
          box-shadow: 0 0 25px var(--accent-primary) !important;
        }
      `}</style>
    </div>
  );
}
