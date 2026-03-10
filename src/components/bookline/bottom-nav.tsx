'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { BVCouleur } from './BVCouleur';

export function BottomNav() {
  const pathname = usePathname();
  const { handleNavigate } = useTransitionRouter();
  const { t } = useEbooks();

  const getCurrentTab = () => (pathname === '/sell' ? 'vendre' : 'acheter');

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Update visual state if URL changes by other means (e.g. browser back/forward)
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [pathname]);

  const handleNavigation = (tab: 'acheter' | 'vendre') => {
    const targetPath = tab === 'acheter' ? '/home' : '/sell';
    
    if (pathname === targetPath || (pathname === '/' && targetPath === '/home')) {
        return;
    }

    // Set the visual state instantly to start the slider animation
    setActiveTab(tab);
    
    // Use the transition handler from the layout
    handleNavigate(targetPath);
  };
  
  const isAcheter = activeTab === 'acheter';

  return (
    <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4">
      <div className="glass-form-element rounded-full flex relative items-center max-w-[16rem] mx-auto">
        <div
          className={cn(
            'absolute top-0 h-full w-1/2 rounded-full transition-all duration-500 ease-in-out bg-black dark:bg-white',
            isAcheter ? 'left-0' : 'left-1/2'
          )}
        >
        </div>
        <button
          onClick={() => handleNavigation('acheter')}
          className={cn(
            'relative z-10 w-1/2 py-3 text-center text-base font-semibold transition-colors duration-150',
            isAcheter ? 'text-white dark:text-black' : 'text-foreground'
          )}
        >
          {t('buy')}
        </button>
        <button
          onClick={() => handleNavigation('vendre')}
          className={cn(
            'relative z-10 w-1/2 py-3 text-center text-base font-semibold transition-colors duration-150',
            !isAcheter ? 'text-white dark:text-black' : 'text-foreground'
          )}
        >
          {t('sell')}
        </button>
      </div>
    </div>
  );
}
