'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-2 left-0 right-0 p-4 mb-4">
      <div className="bg-secondary p-1 rounded-full flex items-center max-w-[16rem] mx-auto shadow-lg">
        <Link href="/home" legacyBehavior passHref>
          <a
            className={cn(
              "w-full text-center rounded-full py-3 text-base font-semibold transition-all duration-300 ease-in-out",
              pathname === '/home' || pathname === '/'
                ? "bg-foreground text-background"
                : "text-foreground bg-transparent"
            )}
          >
            Acheter
          </a>
        </Link>
        <Link href="/sell" legacyBehavior passHref>
          <a
            className={cn(
              "w-full text-center rounded-full py-3 text-base font-semibold transition-all duration-300 ease-in-out",
              pathname === '/sell'
                ? "bg-foreground text-background"
                : "text-foreground bg-transparent"
            )}
          >
            Vendre
          </a>
        </Link>
      </div>
    </div>
  );
}
