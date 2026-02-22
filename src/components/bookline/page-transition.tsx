'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setTransitionStage('fadeOut');
    }
  }, [pathname]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      // Wait for fade out animation to complete
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        prevPathnameRef.current = pathname;
        setTransitionStage('fadeIn');
      }, 150); // This duration should match the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [transitionStage, children, pathname]);

  return (
    <div
      className={cn(
        'transition-opacity duration-150 ease-in-out',
        transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      )}
    >
      {displayChildren}
    </div>
  );
}
