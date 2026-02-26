'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bookline/bottom-nav';
import { EbookProvider } from '@/context/ebook-provider';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';


// --- Transition Context (checkpoint 653da77) ---
// This context provides a centralized way to handle page transitions
// with a consistent fade-in/fade-out effect.
interface TransitionContextType {
  handleNavigate: (path: string) => void;
  handleBack: () => void;
}
const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransitionRouter = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionRouter must be used within BooklineLayout');
  }
  return context;
};
// --- End Transition Context ---


export default function BooklineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const hideBottomNav = pathname === '/profile' || pathname.startsWith('/ebook/');

  const [isPageVisible, setIsPageVisible] = useState(false);

  // Fade in on route change
  useEffect(() => {
    setIsPageVisible(true);
  }, [pathname]);

  // Navigation handlers that fade out first
  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(path);
    }, 300); // Duration of the fade-out animation
  };

  const handleBack = () => {
    setIsPageVisible(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const transitionContextValue = { handleNavigate, handleBack };

  return (
    <EbookProvider>
      <TransitionContext.Provider value={transitionContextValue}>
        <div className={cn("transition-opacity duration-300 ease-in-out", isPageVisible ? "opacity-100" : "opacity-0")}>
          {children}
        </div>
        {!hideBottomNav && <BottomNav />}
      </TransitionContext.Provider>
    </EbookProvider>
  );
}
