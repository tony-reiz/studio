'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/bookline/bottom-nav';
import { PageTransition } from '@/components/bookline/page-transition';

export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideBottomNav = pathname === '/profile';

  return (
    <>
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
