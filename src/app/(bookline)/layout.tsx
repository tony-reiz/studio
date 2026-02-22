import { BottomNav } from '@/components/bookline/bottom-nav';

export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
