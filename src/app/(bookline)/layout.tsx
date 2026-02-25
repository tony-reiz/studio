'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/bookline/bottom-nav';
import { PageTransition } from '@/components/bookline/page-transition';
import { EbookProvider } from '@/context/ebook-provider';

export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideBottomNav = pathname === '/profile' || pathname.startsWith('/ebook/');

  return (
    <EbookProvider>
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      {!hideBottomNav && <BottomNav />}
    </EbookProvider>
  );
}
