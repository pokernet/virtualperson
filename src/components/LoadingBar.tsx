'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname or searchParams change, it means navigation has finished (or started)
    // In App Router, we can't easily detect the "start" of a client-side transition
    // without wrapping the Link component.
    // However, we can show a brief "ping" on every mount/update to give feedback.
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loading-bar" />
      <style jsx>{`
        .animate-loading-bar {
          width: 100%;
          animation: loading 1.5s infinite ease-in-out;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
