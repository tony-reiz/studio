'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/bookline/bottom-nav';
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
      <main>{children}</main>
      {!hideBottomNav && <BottomNav />}
    </EbookProvider>
  );
}
