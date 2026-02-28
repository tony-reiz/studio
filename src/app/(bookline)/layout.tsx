'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/bookline/bottom-nav';


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

  const [isPageVisible, setIsPageVisible] = useState(false);
  const showBottomNav = pathname === '/home' || pathname === '/sell';

  // Fade in on route change
  useEffect(() => {
    setIsPageVisible(true);
  }, [pathname]);

  // Navigation handlers that fade out first
  const handleNavigate = (path: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (pathname === path) return;
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(path);
    }, 300); // Duration of the fade-out animation
  };

  const handleBack = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsPageVisible(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const transitionContextValue = { handleNavigate, handleBack };

  return (
      <TransitionContext.Provider value={transitionContextValue}>
        <div className={cn("transition-opacity duration-300 ease-in-out", isPageVisible ? "opacity-100" : "opacity-0")}>
          {children}
        </div>
        {showBottomNav && <BottomNav />}
      </TransitionContext.Provider>
  );
}
