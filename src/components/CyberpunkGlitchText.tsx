import React from 'react';

export const CyberpunkGlitchText = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`glitch-text-container ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="glitch-layer glitch-layer-1" aria-hidden="true">{children}</span>
      <span className="glitch-layer glitch-layer-2" aria-hidden="true">{children}</span>
      <div className="cyber-scanline" />
    </div>
  );
});
