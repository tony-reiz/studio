'use client';

import { BottomNav } from '@/components/bookline/bottom-nav';
import { PageTransition } from '@/components/bookline/page-transition';

export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </>
  );
}
