'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Initialize with an empty array to avoid using props in initial state, preventing hydration errors.
  const [pages, setPages] = useState<{ node: React.ReactNode; path: string; key: number }[]>([]);
  const keyCounter = useRef(0);

  useEffect(() => {
    // Find if the current page is already in our state
    const currentPage = pages.find(p => p.path === pathname);

    // If the page isn't in the state, add it.
    // This handles both the initial page load and subsequent navigations.
    if (!currentPage) {
      setPages(currentPages => [
        ...currentPages,
        { node: children, path: pathname, key: keyCounter.current++ },
      ]);

      // After the transition animation, we clean up and remove the old page.
      const timer = setTimeout(() => {
        setPages(currentPages => currentPages.filter(p => p.path === pathname));
      }, 300); // This duration must match the animation duration in tailwind.config.ts

      return () => clearTimeout(timer);
    }
  }, [pathname, children, pages]);

  // On the server and for the initial client render, `pages` is empty.
  // We render children directly to ensure the server and client HTML match.
  if (!pages.length) {
    return <>{children}</>;
  }

  // Once mounted on the client, we render the transition wrapper.
  return (
    <div className="relative grid">
      {pages.map(page => (
        <div
          key={page.key}
          className={cn(
            'col-start-1 row-start-1',
            {
              // Apply animations only when transitioning between pages.
              'animate-cross-fade-out': pages.length > 1 && page.path !== pathname,
              'animate-cross-fade-in': pages.length > 1 && page.path === pathname,
            }
          )}
        >
          {page.node}
        </div>
      ))}
    </div>
  );
}
