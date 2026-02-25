'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === '/home' || pathname === '/';

  return (
    <div className="fixed bottom-12 left-0 right-0 p-4 md:bottom-2 md:mb-4">
      <div className="bg-secondary rounded-full flex relative items-center max-w-[16rem] mx-auto shadow-lg">
        <div
          className={cn(
            'absolute top-0 h-full w-1/2 rounded-full bg-foreground transition-all duration-150 ease-in-out',
            isHome ? 'left-0' : 'left-1/2'
          )}
        />
        <Link
          href="/home"
          className={cn(
            'relative z-10 w-1/2 py-3 text-center text-base font-semibold transition-colors duration-150',
            isHome ? 'text-background' : 'text-foreground'
          )}
        >
          acheter
        </Link>
        <Link
          href="/sell"
          className={cn(
            'relative z-10 w-1/2 py-3 text-center text-base font-semibold transition-colors duration-150',
            !isHome ? 'text-background' : 'text-foreground'
          )}
        >
          vendre
        </Link>
      </div>
    </div>
  );
}
