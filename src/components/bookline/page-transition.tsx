'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Using a unique key for each page ensures React treats them as distinct elements
  const [pages, setPages] = useState([{ node: children, path: pathname, key: 0 }]);
  const keyCounter = useRef(1);

  useEffect(() => {
    if (pathname !== pages[pages.length - 1].path) {
      // Add the new page to the array
      setPages(currentPages => [
        ...currentPages,
        { node: children, path: pathname, key: keyCounter.current++ },
      ]);

      // After the transition duration, remove the old page(s)
      const timer = setTimeout(() => {
        setPages(currentPages => currentPages.filter(p => p.path === pathname));
      }, 1000); // Corresponds to duration-1000

      return () => clearTimeout(timer);
    }
  }, [pathname, children, pages]);


  return (
    <div className="relative grid">
      {pages.map(page => (
        <div
          key={page.key}
          className={cn(
            'col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out',
            {
              'opacity-100': page.path === pathname,
              'opacity-0': page.path !== pathname,
            }
          )}
        >
          {page.node}
        </div>
      ))}
    </div>
  );
}
