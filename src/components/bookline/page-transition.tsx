'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pages, setPages] = useState([{ node: children, path: pathname }]);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      setPages(currentPages => [...currentPages, { node: children, path: pathname }]);

      const timer = setTimeout(() => {
        setPages(currentPages => currentPages.filter(p => p.path === pathname));
      }, 300); // Match this with CSS transition duration

      prevPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, children]);

  return (
    <div className="relative grid">
      {pages.map(page => (
        <div
          key={page.path}
          className={cn(
            'col-start-1 row-start-1 transition-opacity duration-300 ease-in-out',
            page.path === pathname ? 'opacity-100' : 'opacity-0'
          )}
        >
          {page.node}
        </div>
      ))}
    </div>
  );
}
