'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pages, setPages] = useState([{ node: children, path: pathname, key: 0 }]);
  const keyCounter = useRef(1);
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname;
      setPages(currentPages => [
        ...currentPages,
        { node: children, path: pathname, key: keyCounter.current++ },
      ]);

      const timer = setTimeout(() => {
        setPages(currentPages => currentPages.filter(p => p.path === pathname));
      }, 300); // Must match animation duration

      return () => clearTimeout(timer);
    }
  }, [pathname, children]);

  return (
    <div className="relative grid">
      {pages.map(page => (
        <div
          key={page.key}
          className={cn(
            'col-start-1 row-start-1',
            {
              'animate-cross-fade-out': page.path !== pathname,
              'animate-cross-fade-in': page.path === pathname && pages.length > 1,
            }
          )}
        >
          {page.node}
        </div>
      ))}
    </div>
  );
}
