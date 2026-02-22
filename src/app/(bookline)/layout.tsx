'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/bookline/bottom-nav';

export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <>
      <main key={pathname} className="animate-in fade-in-0 duration-300">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
