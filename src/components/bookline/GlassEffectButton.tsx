'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';

interface GlassEffectButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassEffectButton({ children, className, onClick }: GlassEffectButtonProps) {
  const { theme } = useEbooks();

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden active:scale-95 chromatic-aberration-container",
        "backdrop-blur-lg bg-white/10",
        theme === 'dark' ? 'text-white' : 'text-black',
        className
      )}
    >
      <span 
        className="relative z-10"
        data-text={typeof children === 'string' ? children : ''}
      >
        {children}
      </span>
    </button>
  );
}
